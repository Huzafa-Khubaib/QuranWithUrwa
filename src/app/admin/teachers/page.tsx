import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { getProfilesByRole } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Teachers",
  robots: { index: false, follow: false },
};

export default function AdminTeachersPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <TeachersContent />
    </Suspense>
  );
}

async function TeachersContent() {
  await connection();
  const teachers = await getProfilesByRole("teacher");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">Teachers</h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Create teacher accounts from Create user, then assign them to classes.
          </p>
        </div>
        <ClayButton href="/admin/users" variant="primary">
          Create teacher
        </ClayButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t, i) => {
          const colors = ["peach", "mint", "sky", "yellow"] as const;
          return (
            <ClayCard key={t.id} color={colors[i % colors.length]} className="p-5">
              <div className="clay-sm mb-3 flex size-12 items-center justify-center rounded-full bg-[#FFFAF3] text-lg font-black">
                {t.full_name.slice(0, 1).toUpperCase()}
              </div>
              <h2 className="text-lg font-black text-ink">{t.full_name}</h2>
              <p className="text-xs font-bold text-ink-muted">{t.email || "Email hidden"}</p>
              <p className="mt-1 text-xs font-semibold text-ink">{t.phone || "No phone"}</p>
            </ClayCard>
          );
        })}
        {!teachers.length ? (
          <ClayCard color="white" className="p-6 sm:col-span-2">
            <p className="font-extrabold text-ink">No teachers yet</p>
            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Use Create user with role Teacher.
            </p>
          </ClayCard>
        ) : null}
      </div>
    </div>
  );
}
