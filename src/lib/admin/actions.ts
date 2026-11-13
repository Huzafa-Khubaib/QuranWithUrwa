"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { sendUserEmail } from "@/lib/email/send-user-email";
import { siteConfig } from "@/lib/site";

export type AdminActionState = {
  error?: string;
  success?: string;
  id?: string;
};

async function requireAdmin() {
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Not authorized." as const, profile: null };
  }
  return { error: null, profile };
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function updateRequestStatusAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const kind = String(formData.get("kind"));
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  if (
    !["demo", "enrollment"].includes(kind) ||
    !z.string().uuid().safeParse(id).success ||
    !["approved", "rejected", "pending"].includes(status)
  ) {
    return { error: "Invalid request update." };
  }

  const table = kind === "demo" ? "demo_requests" : "enrollment_requests";
  const supabase = await createClient();

  if (status === "rejected") {
    const { error } = await supabase
      .from(table)
      .update({ status: "rejected" })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/requests");
    return { success: "Request rejected." };
  }

  if (status !== "approved") {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/requests");
    return { success: "Status updated." };
  }

  // Approve → create student account + email credentials
  const { data: request, error: fetchError } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !request) return { error: "Request not found." };
  if (request.status === "approved" && request.processed_user_id) {
    return { success: "Already approved." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Missing SUPABASE_SERVICE_ROLE_KEY." };
  }

  const password = generatePassword();
  const fullName = String(request.child_name || request.parent_name);
  const email = String(request.email).trim().toLowerCase();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "student",
      phone: request.whatsapp_number,
    },
  });

  // If email already exists, look up user and still mark approved
  let userId = created?.user?.id;
  if (createError || !userId) {
    const { data: listed } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = listed?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );
    if (!existing) {
      return { error: createError?.message ?? "Could not create student account." };
    }
    userId = existing.id;
  }

  await admin.from("profiles").upsert({
    id: userId,
    full_name: fullName,
    role: "student",
    phone: String(request.whatsapp_number),
  });

  const { error: updateError } = await supabase
    .from(table)
    .update({ status: "approved", processed_user_id: userId })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  const loginUrl = `${siteConfig.url}/login/student`;
  const emailResult = await sendUserEmail({
    to: email,
    subject: `Welcome to ${siteConfig.name} — your login details`,
    title: "Your student account is ready",
    intro: `Assalamu Alaikum ${request.parent_name}! Your enrollment/demo was approved. Here are the login details for ${fullName}.`,
    rows: [
      ["Portal", loginUrl],
      ["Email", email],
      ["Temporary password", password],
      ["Course interest", String(request.course_interest)],
    ],
    htmlExtra: `<p style="margin-top:16px;color:#6b534e;font-size:14px">Please sign in and change the password from Settings → Forgot password if needed. JazakAllah khair.</p>`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/students");

  if (!emailResult.ok) {
    return {
      success: `Approved and account created, but email failed: ${emailResult.error}. Password: ${password}`,
      id: userId,
    };
  }

  return {
    success: "Approved — student account created and credentials emailed.",
    id: userId,
  };
}

export async function saveCourseAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const arabic = String(formData.get("arabicTitle") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const level = String(formData.get("level") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";
  const slugInput = String(formData.get("slug") || "").trim();

  if (title.length < 2) return { error: "Title is required." };

  const slug = slugify(slugInput || title);
  const supabase = await createClient();
  const payload = {
    title,
    slug,
    arabic_title: arabic || null,
    description: description || null,
    level: level || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_active: isActive,
  };

  if (id && z.string().uuid().safeParse(id).success) {
    const { error } = await supabase.from("courses").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("courses").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: "Course saved." };
}

export async function saveClassAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const courseId = String(formData.get("courseId") || "");
  const teacherId = String(formData.get("teacherId") || "");
  const platform = String(formData.get("platform") || "meet");
  const meetingLink = String(formData.get("meetingLink") || "").trim();
  const startTime = String(formData.get("startTime") || "").trim();
  const duration = Number(formData.get("duration") || 45);
  const scheduleRaw = String(formData.get("scheduleDays") || "");
  const isActive = formData.get("isActive") !== "off";

  if (
    title.length < 2 ||
    !z.string().uuid().safeParse(courseId).success ||
    !z.string().uuid().safeParse(teacherId).success
  ) {
    return { error: "Title, course, and teacher are required." };
  }

  const schedule_days = scheduleRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const payload = {
    title,
    course_id: courseId,
    teacher_id: teacherId,
    platform: platform === "zoom" ? "zoom" : "meet",
    meeting_link: meetingLink || null,
    start_time: startTime || null,
    duration_minutes: Number.isFinite(duration) ? duration : 45,
    schedule_days,
    is_active: isActive,
  };

  if (id && z.string().uuid().safeParse(id).success) {
    const { error } = await supabase.from("classes").update(payload).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath(`/admin/classes/${id}`);
  } else {
    const { data, error } = await supabase
      .from("classes")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    revalidatePath("/admin/classes");
    return { success: "Class created.", id: data.id };
  }

  revalidatePath("/admin/classes");
  return { success: "Class saved." };
}

export async function setClassStudentsAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const classId = String(formData.get("classId") || "");
  if (!z.string().uuid().safeParse(classId).success) {
    return { error: "Invalid class." };
  }

  const studentIds = formData.getAll("studentId").map(String).filter(Boolean);
  const supabase = await createClient();

  const { error: delError } = await supabase
    .from("class_students")
    .delete()
    .eq("class_id", classId);
  if (delError) return { error: delError.message };

  if (studentIds.length) {
    const { error } = await supabase.from("class_students").insert(
      studentIds.map((student_id) => ({ class_id: classId, student_id }))
    );
    if (error) return { error: error.message };
  }

  revalidatePath(`/admin/classes/${classId}`);
  revalidatePath("/admin/classes");
  return { success: "Class roster updated." };
}

export async function updateFeeStatusAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const studentId = String(formData.get("studentId") || "");
  const yearMonth = String(formData.get("yearMonth") || "");
  const status = String(formData.get("status") || "unpaid");
  const amountRaw = String(formData.get("amount") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (
    !z.string().uuid().safeParse(studentId).success ||
    !/^\d{4}-\d{2}$/.test(yearMonth) ||
    !["paid", "unpaid"].includes(status)
  ) {
    return { error: "Invalid fee update." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("fee_records").upsert(
    {
      student_id: studentId,
      year_month: yearMonth,
      status,
      amount: amountRaw ? Number(amountRaw) : null,
      notes: notes || null,
      updated_by: auth.profile.id,
    },
    { onConflict: "student_id,year_month" }
  );

  if (error) return { error: error.message };

  revalidatePath("/admin/fees");
  revalidatePath("/admin");
  return { success: "Fee status saved." };
}

export async function updateProfileAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const id = String(formData.get("id") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "");

  if (
    !z.string().uuid().safeParse(id).success ||
    fullName.length < 2 ||
    !["admin", "teacher", "student"].includes(role)
  ) {
    return { error: "Invalid profile update." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      role,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/teachers");
  revalidatePath("/admin/students");
  return { success: "Profile updated." };
}
