import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ClayCard } from "@/components/shared/clay-card";
import { SessionForm } from "@/components/teacher/session-form";
import { AttendanceForm } from "@/components/teacher/attendance-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import {
  getSessionAttendance,
  getTeacherSession,
} from "@/lib/teacher/data";

export const metadata: Metadata = {
  title: "Session",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default function TeacherSessionPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <SessionContent params={params} />
    </Suspense>
  );
}

async function SessionContent({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const session = await getTeacherSession(profile.id, id);
  if (!session) notFound();

  const attendance = await getSessionAttendance(profile.id, id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">
          {session.class_title}
        </h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Session ·{" "}
          {new Date(`${session.session_date}T00:00:00`).toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="sky" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Recording & notes</h2>
          <SessionForm
            classId={session.class_id}
            classTitle={session.class_title}
            sessionId={session.id}
            defaultDate={session.session_date}
            defaultRecordingUrl={session.recording_url ?? ""}
            defaultNotes={session.notes ?? ""}
          />
        </ClayCard>

        <ClayCard color="mint" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Mark attendance</h2>
          <AttendanceForm sessionId={session.id} rows={attendance} />
        </ClayCard>
      </div>
    </div>
  );
}
