import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { AnnouncementForm } from "@/components/teacher/announcement-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getTeacherClasses } from "@/lib/teacher/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Announcements",
  robots: { index: false, follow: false },
};

export default function TeacherAnnouncementsPage() {
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

  const classes = await getTeacherClasses(profile.id);
  const classIds = classes.map((c) => c.id);

  let recent: Array<{
    id: string;
    title: string;
    body: string;
    created_at: string;
    class_id: string | null;
  }> = [];

  try {
    const supabase = await createClient();
    if (classIds.length) {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, body, created_at, class_id")
        .eq("created_by", profile.id)
        .order("created_at", { ascending: false })
        .limit(20);
      recent = data ?? [];
    }
  } catch {
    recent = [];
  }

  const titleById = Object.fromEntries(classes.map((c) => [c.id, c.title]));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Announcements</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Post a message to one of your classes — students see it in their portal.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="peach" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">New announcement</h2>
          <AnnouncementForm classes={classes} />
        </ClayCard>

        <ClayCard color="white" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Your recent posts</h2>
          <ul className="space-y-3">
            {recent.map((a) => (
              <li key={a.id} className="clay-inset rounded-2xl bg-cream p-4">
                <p className="text-[11px] font-extrabold text-ink-muted">
                  {a.class_id ? titleById[a.class_id] ?? "Class" : "Class"} ·{" "}
                  {new Date(a.created_at).toLocaleString()}
                </p>
                <p className="mt-1 text-sm font-extrabold text-ink">{a.title}</p>
                <p className="mt-1 text-xs font-semibold text-ink-muted whitespace-pre-wrap">
                  {a.body}
                </p>
              </li>
            ))}
            {!recent.length ? (
              <li className="text-sm font-semibold text-ink-muted">
                No announcements yet.
              </li>
            ) : null}
          </ul>
        </ClayCard>
      </div>
    </div>
  );
}
