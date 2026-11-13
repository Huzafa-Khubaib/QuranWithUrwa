import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { RecordingsList } from "@/components/student/recordings-list";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getStudentSessions } from "@/lib/student/data";

export const metadata: Metadata = {
  title: "Recordings",
  robots: { index: false, follow: false },
};

export default function StudentRecordingsPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <RecordingsContent />
    </Suspense>
  );
}

async function RecordingsContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const sessions = await getStudentSessions(profile.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Recordings</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Session videos and Drive links from your classes only.
        </p>
      </div>
      <RecordingsList sessions={sessions} />
    </div>
  );
}
