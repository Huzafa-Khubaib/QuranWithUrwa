"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ROLE_HOME, isUserRole, type UserRole } from "@/lib/auth/roles";
import {
  DEMO_COOKIE,
  findDemoAccount,
  isDemoAuthEnabled,
  serializeDemoSession,
} from "@/lib/auth/demo";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionProfile } from "@/lib/auth/get-profile";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
  expectedRole: z.enum(["admin", "teacher", "student"]),
});

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    expectedRole: formData.get("expectedRole"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const { email, password, expectedRole } = parsed.data;

  if (isDemoAuthEnabled()) {
    const demo = findDemoAccount(email, password);
    if (demo) {
      if (demo.role !== expectedRole) {
        return {
          error: `This login is for ${expectedRole}s only. Use the correct portal login.`,
        };
      }
      const jar = await cookies();
      jar.set(DEMO_COOKIE, serializeDemoSession(demo), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      redirect(ROLE_HOME[demo.role]);
    }
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return {
      error: isDemoAuthEnabled()
        ? "Invalid demo email/password. Use the demo credentials shown on this page."
        : "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !isUserRole(profile.role)) {
    await supabase.auth.signOut();
    return { error: "Your account profile is missing. Contact an admin." };
  }

  if (profile.role !== expectedRole) {
    await supabase.auth.signOut();
    return {
      error: `This login is for ${expectedRole}s only. Use the correct portal login.`,
    };
  }

  redirect(ROLE_HOME[profile.role as UserRole]);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE);

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Demo-only / missing Supabase — cookie clear is enough
  }

  redirect("/");
}

const forgotSchema = z.object({
  email: z.string().trim().email(),
});

export async function forgotPasswordAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Please enter a valid email." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase is not configured." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for that email, a reset link is on its way. Check your inbox.",
  };
}

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string().min(8),
});

export async function resetPasswordAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = resetSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid password." };
  }

  if (parsed.data.password !== parsed.data.confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const { profile } = await getSessionProfile();
  redirect(profile ? ROLE_HOME[profile.role] : "/login/student");
}

const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  fullName: z.string().trim().min(2).max(80),
  role: z.enum(["teacher", "student", "admin"]),
  phone: z.string().trim().max(20).optional(),
});

export async function createUserAccountAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can create accounts." };
  }

  const parsed = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { error: "Please fill all required fields correctly." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Missing SUPABASE_SERVICE_ROLE_KEY." };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      role: parsed.data.role,
    },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Could not create user." };
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: parsed.data.fullName,
    role: parsed.data.role,
    phone: parsed.data.phone || null,
  });

  if (profileError) {
    return {
      error: `User created but profile failed: ${profileError.message}`,
    };
  }

  return {
    success: `Account created for ${parsed.data.fullName} (${parsed.data.role}).`,
  };
}
