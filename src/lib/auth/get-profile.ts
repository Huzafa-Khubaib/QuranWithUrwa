import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isUserRole, type UserRole } from "@/lib/auth/roles";
import {
  DEMO_COOKIE,
  isDemoAuthEnabled,
  parseDemoCookie,
} from "@/lib/auth/demo";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
};

export async function getSessionProfile(): Promise<{
  userId: string | null;
  profile: Profile | null;
}> {
  if (isDemoAuthEnabled()) {
    const jar = await cookies();
    const demo = parseDemoCookie(jar.get(DEMO_COOKIE)?.value);
    if (demo) {
      return { userId: demo.id, profile: demo };
    }
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { userId: null, profile: null };
    }

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (!data || !isUserRole(data.role)) {
      return { userId: user.id, profile: null };
    }

    return {
      userId: user.id,
      profile: {
        id: data.id,
        full_name: data.full_name,
        role: data.role,
        phone: data.phone,
        avatar_url: data.avatar_url,
      },
    };
  } catch {
    return { userId: null, profile: null };
  }
}
