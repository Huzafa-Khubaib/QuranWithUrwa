import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { RequestActions } from "@/components/admin/request-actions";
import { PortalLoading } from "@/components/shared/portal-loading";
import { getIntakeRequests } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Requests",
  robots: { index: false, follow: false },
};

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<PortalLoading cards={2} />}>
      <RequestsContent />
    </Suspense>
  );
}

async function RequestsContent() {
  await connection();
  const requests = await getIntakeRequests();
  const colors = ["peach", "mint", "sky", "yellow"] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">
          Demo & enrollment requests
        </h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Approve creates a student login and emails credentials. WhatsApp opens a
          reply to the parent number.
        </p>
      </div>

      {!requests.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <p className="font-extrabold text-ink">No requests yet</p>
        </ClayCard>
      ) : (
        <div className="space-y-3">
          {requests.map((r, i) => (
            <ClayCard
              key={`${r.kind}-${r.id}`}
              color={colors[i % colors.length]}
              className="p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold tracking-wide text-ink/60 uppercase">
                    {r.kind} · {r.status} ·{" "}
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                  <h2 className="mt-1 text-lg font-black text-ink">
                    {r.child_name}{" "}
                    <span className="font-bold text-ink-muted">
                      (age {r.child_age})
                    </span>
                  </h2>
                  <p className="break-words text-sm font-semibold text-ink-muted">
                    Parent: {r.parent_name} · {r.email} · {r.whatsapp_number}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">
                    {r.course_interest} · {r.preferred_time} · {r.country}
                  </p>
                  {r.message ? (
                    <p className="mt-2 text-sm font-semibold text-ink-muted">
                      {r.message}
                    </p>
                  ) : null}
                </div>
                <RequestActions request={r} />
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
