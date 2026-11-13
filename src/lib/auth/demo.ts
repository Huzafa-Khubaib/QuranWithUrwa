import type { UserRole } from "@/lib/auth/roles";
import type { Profile } from "@/lib/auth/get-profile";

export const DEMO_COOKIE = "nqa_demo_session";
export const DEMO_PASSWORD = "Demo@1234";

export type DemoAccount = {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  id: string;
};

/** Local-only accounts — enabled when DEMO_AUTH=true */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin@demo.urwa",
    password: DEMO_PASSWORD,
    role: "admin",
    fullName: "Demo Admin",
    id: "demo-admin",
  },
  {
    email: "teacher@demo.urwa",
    password: DEMO_PASSWORD,
    role: "teacher",
    fullName: "Ustadh Demo",
    id: "demo-teacher",
  },
  {
    email: "student@demo.urwa",
    password: DEMO_PASSWORD,
    role: "student",
    fullName: "Amina Demo",
    id: "demo-student",
  },
];

export function isDemoAuthEnabled() {
  return process.env.DEMO_AUTH === "true" || process.env.NEXT_PUBLIC_DEMO_AUTH === "true";
}

export function findDemoAccount(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return (
    DEMO_ACCOUNTS.find(
      (a) => a.email === normalized && a.password === password
    ) ?? null
  );
}

export function demoAccountByRole(role: UserRole) {
  return DEMO_ACCOUNTS.find((a) => a.role === role) ?? null;
}

export function parseDemoCookie(value: string | undefined | null): Profile | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as {
      id?: string;
      full_name?: string;
      role?: UserRole;
    };
    const match = DEMO_ACCOUNTS.find((a) => a.id === parsed.id);
    if (!match) return null;
    return {
      id: match.id,
      full_name: match.fullName,
      role: match.role,
      phone: null,
      avatar_url: null,
    };
  } catch {
    return null;
  }
}

export function serializeDemoSession(account: DemoAccount) {
  return JSON.stringify({
    id: account.id,
    full_name: account.fullName,
    role: account.role,
  });
}
