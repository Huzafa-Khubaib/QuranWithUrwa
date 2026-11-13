import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { FeeRowForm } from "@/components/admin/fee-row-form";
import { PortalLoading } from "@/components/shared/portal-loading";
import { getFeeRecords } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Fees",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default function AdminFeesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PortalLoading cards={3} />}>
      <FeesContent searchParams={searchParams} />
    </Suspense>
  );
}

async function FeesContent({ searchParams }: PageProps) {
  await connection();
  const sp = await searchParams;
  const now = new Date();
  const yearMonth =
    sp.month && /^\d{4}-\d{2}$/.test(sp.month)
      ? sp.month
      : now.toISOString().slice(0, 7);

  const records = await getFeeRecords(yearMonth);
  const paid = records.filter((r) => r.status === "paid").length;
  const unpaid = records.length - paid;

  const prev = shiftMonth(yearMonth, -1);
  const next = shiftMonth(yearMonth, 1);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">
            Fee status tracker
          </h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Paid / unpaid per student per month.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ClayButton href={`/admin/fees?month=${prev}`} variant="outline">
            ← {prev}
          </ClayButton>
          <ClayButton href={`/admin/fees?month=${next}`} variant="outline">
            {next} →
          </ClayButton>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <ClayCard color="sky" className="p-4">
          <p className="text-xl font-black text-ink sm:text-2xl">{yearMonth}</p>
          <p className="text-[11px] font-extrabold text-ink-muted">Month</p>
        </ClayCard>
        <ClayCard color="mint" className="p-4">
          <p className="text-xl font-black text-ink sm:text-2xl">{paid}</p>
          <p className="text-[11px] font-extrabold text-ink-muted">Paid</p>
        </ClayCard>
        <ClayCard color="peach" className="p-4">
          <p className="text-xl font-black text-ink sm:text-2xl">{unpaid}</p>
          <p className="text-[11px] font-extrabold text-ink-muted">Unpaid</p>
        </ClayCard>
      </div>

      <ClayCard color="white" className="space-y-2 p-4 sm:p-5">
        {!records.length ? (
          <p className="p-4 text-sm font-semibold text-ink-muted">
            No students yet — approve requests or create student accounts first.
          </p>
        ) : (
          records.map((r) => (
            <FeeRowForm key={r.student_id} record={r} yearMonth={yearMonth} />
          ))
        )}
      </ClayCard>
    </div>
  );
}

function shiftMonth(yearMonth: string, delta: number) {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
