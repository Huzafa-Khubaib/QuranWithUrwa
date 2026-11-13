import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Megaphone } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getStudentAnnouncements } from "@/lib/student/data";

export const metadata: Metadata = {
  title: "Announcements",
  robots: { index: false, follow: false },
};

export default function StudentAnnouncementsPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <AnnouncementsContent />
    </Suspense>
  );
}

async function AnnouncementsContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const items = await getStudentAnnouncements(profile.id);
  const colors = ["mint", "peach", "sky", "yellow"] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Announcements</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Academy-wide and class notes for you.
        </p>
      </div>

      {!items.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <Megaphone className="mx-auto size-10 text-ink/25" aria-hidden />
          <p className="mt-3 font-extrabold text-ink">All quiet for now</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            New announcements from teachers or admin will land here.
          </p>
        </ClayCard>
      ) : (
        <div className="space-y-3">
          {items.map((a, i) => (
            <ClayCard key={a.id} color={colors[i % colors.length]} className="p-5">
              <p className="text-xs font-extrabold text-ink/55">
                {new Date(a.created_at).toLocaleString()}
              </p>
              <h2 className="mt-1 text-lg font-black text-ink">{a.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-relaxed text-ink-muted">
                {a.body}
              </p>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
