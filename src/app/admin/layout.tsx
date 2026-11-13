import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSessionProfile } from "@/lib/auth/get-profile";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PortalFallback />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/login/admin");
  }

  return (
    <AdminShell fullName={profile.full_name || "Admin"}>{children}</AdminShell>
  );
}

function PortalFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-10 text-sm font-bold text-ink-muted">
      Loading portal…
    </div>
  );
}
