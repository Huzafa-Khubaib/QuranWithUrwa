export const ROLES = ["admin", "teacher", "student"] as const;
export type UserRole = (typeof ROLES)[number];

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

export const ROLE_LOGIN: Record<UserRole, string> = {
  admin: "/login/admin",
  teacher: "/login/teacher",
  student: "/login/student",
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function roleFromPathname(pathname: string): UserRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/teacher" || pathname.startsWith("/teacher/")) return "teacher";
  if (pathname === "/student" || pathname.startsWith("/student/")) return "student";
  return null;
}

export function loginRoleFromPathname(pathname: string): UserRole | null {
  if (pathname.startsWith("/login/admin")) return "admin";
  if (pathname.startsWith("/login/teacher")) return "teacher";
  if (pathname.startsWith("/login/student")) return "student";
  return null;
}
