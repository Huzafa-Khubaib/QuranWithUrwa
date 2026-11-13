import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { TeacherShell } from "@/components/teacher/teacher-shell";
import { getSessionProfile } from "@/lib/auth/get-profile";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PortalFallback />}>
      <TeacherGate>{children}</TeacherGate>
    </Suspense>
  );
}

async function TeacherGate({ children }: { children: React.ReactNode }) {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "teacher") {
    redirect("/login/teacher");
  }

  return (
    <TeacherShell fullName={profile.full_name || "Teacher"}>
      {children}
    </TeacherShell>
  );
}

function PortalFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-10 text-sm font-bold text-ink-muted">
      Loading portal…
    </div>
  );
}
