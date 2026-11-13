import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Teacher Login",
  robots: { index: false, follow: false },
};

export default function TeacherLoginPage() {
  return (
    <AuthShell accent="peach">
      <LoginForm role="teacher" />
    </AuthShell>
  );
}
