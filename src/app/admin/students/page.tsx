import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { getProfilesByRole } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Students",
  robots: { index: false, follow: false },
};

export default function AdminStudentsPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <StudentsContent />
    </Suspense>
  );
}

async function StudentsContent() {
  await connection();
  const students = await getProfilesByRole("student");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">Students</h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            From approved requests or manual Create user. Enroll them in Classes.
          </p>
        </div>
        <div className="flex gap-2">
          <ClayButton href="/admin/requests" variant="outline">
            Requests
          </ClayButton>
          <ClayButton href="/admin/users" variant="primary">
            Create student
          </ClayButton>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((s, i) => {
          const colors = ["mint", "peach", "sky", "yellow"] as const;
          return (
            <ClayCard key={s.id} color={colors[i % colors.length]} className="p-5">
              <h2 className="text-lg font-black text-ink">{s.full_name}</h2>
              <p className="text-xs font-bold text-ink-muted">{s.email || "Email hidden"}</p>
              <p className="mt-1 text-xs font-semibold text-ink">{s.phone || "No phone"}</p>
            </ClayCard>
          );
        })}
        {!students.length ? (
          <ClayCard color="white" className="p-6 sm:col-span-2">
            <p className="font-extrabold text-ink">No students yet</p>
          </ClayCard>
        ) : null}
      </div>
    </div>
  );
}
