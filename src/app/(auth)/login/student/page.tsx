import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Student Login",
  robots: { index: false, follow: false },
};

export default function StudentLoginPage() {
  return (
    <AuthShell accent="mint">
      <LoginForm role="student" />
    </AuthShell>
  );
}
