import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { PortalLoading } from "@/components/shared/portal-loading";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getAdminStats, getIntakeRequests } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Overview",
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminHome />
    </Suspense>
  );
}

async function AdminHome() {
  await connection();
  const { profile } = await getSessionProfile();
  const [stats, requests] = await Promise.all([
    getAdminStats(),
    getIntakeRequests(),
  ]);

  const pending = requests.filter((r) => r.status === "pending").slice(0, 5);

  return (
    <div className="space-y-5">
      <ClayCard color="sky" className="p-6 sm:p-8">
        <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-black text-ink">
          Assalamu Alaikum, {profile?.full_name?.split(/\s+/)[0] || "Admin"}
        </h1>
        <p className="mt-2 max-w-xl text-sm font-semibold text-ink-muted">
          Approve requests, manage teachers & classes, and track monthly fees.
        </p>
      </ClayCard>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Pending requests", value: stats.pendingRequests, color: "peach" as const },
          { label: "Students", value: stats.students, color: "mint" as const },
          { label: "Teachers", value: stats.teachers, color: "yellow" as const },
          { label: "Classes", value: stats.classes, color: "sky" as const },
          { label: "Unpaid fees", value: stats.unpaidFees, color: "peach" as const },
          { label: "Paid this month", value: stats.paidFeesThisMonth, color: "mint" as const },
        ].map((s) => (
          <ClayCard key={s.label} color={s.color} className="p-4">
            <p className="text-2xl font-black text-ink">{s.value}</p>
            <p className="text-[11px] font-extrabold text-ink-muted">{s.label}</p>
          </ClayCard>
        ))}
      </div>

      <ClayCard color="white" className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-black text-ink">Pending requests</h2>
          <ClayButton href="/admin/requests" variant="outline">
            View all
          </ClayButton>
        </div>
        <ul className="space-y-2">
          {pending.map((r) => (
            <li
              key={`${r.kind}-${r.id}`}
              className="clay-sm rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-ink"
            >
              <span className="text-[10px] font-extrabold uppercase text-ink-muted">
                {r.kind}
              </span>
              <p>
                {r.child_name} · {r.parent_name}
              </p>
              <p className="text-xs font-semibold text-ink-muted">
                {r.course_interest} · {r.email}
              </p>
            </li>
          ))}
          {!pending.length ? (
            <li className="text-sm font-semibold text-ink-muted">
              No pending requests — nice and clear.
            </li>
          ) : null}
        </ul>
      </ClayCard>

      <div className="flex flex-wrap gap-2">
        <ClayButton href="/admin/classes" variant="primary">
          Manage classes
        </ClayButton>
        <ClayButton href="/admin/fees" variant="peach">
          Fee tracker
        </ClayButton>
        <ClayButton href="/admin/users" variant="outline">
          Create user
        </ClayButton>
      </div>
    </div>
  );
}
