import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { SessionForm } from "@/components/teacher/session-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getTeacherClasses, getTeacherSessions } from "@/lib/teacher/data";

export const metadata: Metadata = {
  title: "Sessions",
  robots: { index: false, follow: false },
};

export default function TeacherSessionsPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <SessionsContent />
    </Suspense>
  );
}

async function SessionsContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const [sessions, classes] = await Promise.all([
    getTeacherSessions(profile.id),
    getTeacherClasses(profile.id),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Sessions</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Log recordings & notes, then open a session to mark attendance.
        </p>
      </div>

      {classes[0] ? (
        <ClayCard color="peach" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">New session log</h2>
          <SessionForm classId={classes[0].id} classTitle={classes[0].title} />
          {classes.length > 1 ? (
            <p className="mt-3 text-xs font-semibold text-ink-muted">
              Tip: open a class page to log a session for a different class.
            </p>
          ) : null}
        </ClayCard>
      ) : null}

      <ClayCard color="white" className="p-5 sm:p-6">
        <h2 className="mb-3 text-lg font-black text-ink">All sessions</h2>
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/teacher/sessions/${s.id}`}
                className="clay-sm flex flex-col gap-1 rounded-2xl bg-cream px-4 py-3 hover:brightness-95 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm font-extrabold text-ink">
                  {s.class_title} ·{" "}
                  {new Date(`${s.session_date}T00:00:00`).toLocaleDateString()}
                </span>
                <span className="text-xs font-bold text-ink-muted">
                  {s.recording_url ? "Has recording" : "No recording"} · Manage →
                </span>
              </Link>
            </li>
          ))}
          {!sessions.length ? (
            <li className="text-sm font-semibold text-ink-muted">
              No sessions yet.
            </li>
          ) : null}
        </ul>
        <div className="mt-4">
          <ClayButton href="/teacher/classes" variant="outline">
            Go to classes
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
