import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { StudentShell } from "@/components/student/student-shell";
import { getSessionProfile } from "@/lib/auth/get-profile";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PortalFallback />}>
      <StudentGate>{children}</StudentGate>
    </Suspense>
  );
}

async function StudentGate({ children }: { children: React.ReactNode }) {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "student") {
    redirect("/login/student");
  }

  return (
    <StudentShell
      fullName={profile.full_name || "Student"}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </StudentShell>
  );
}

function PortalFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-10 text-sm font-bold text-ink-muted">
      Loading portal…
    </div>
  );
}
