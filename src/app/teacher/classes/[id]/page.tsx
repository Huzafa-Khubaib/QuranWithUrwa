import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ExternalLink, Video } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { CreateStudentForm } from "@/components/teacher/create-student-form";
import { MeetingLinkForm } from "@/components/teacher/meeting-link-form";
import { SessionForm } from "@/components/teacher/session-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import {
  getClassStudents,
  getTeacherClass,
  getTeacherSessions,
} from "@/lib/teacher/data";
import { formatTimeLabel } from "@/lib/student/schedule";

export const metadata: Metadata = {
  title: "Class Detail",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default function TeacherClassDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <ClassDetail params={params} />
    </Suspense>
  );
}

async function ClassDetail({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const classItem = await getTeacherClass(profile.id, id);
  if (!classItem) notFound();

  const [students, sessions] = await Promise.all([
    getClassStudents(profile.id, id),
    getTeacherSessions(profile.id, id),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
            {classItem.course_title ?? "Course"}
          </p>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">
            {classItem.title}
          </h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {classItem.schedule_days.join(", ") || "Days TBD"} ·{" "}
            {formatTimeLabel(classItem.start_time)} · {classItem.student_count}{" "}
            students
          </p>
        </div>
        {classItem.meeting_link ? (
          <ClayButton href={classItem.meeting_link} external variant="primary" size="lg">
            <Video className="size-4" aria-hidden />
            Start Class
            <ExternalLink className="size-3.5 opacity-70" aria-hidden />
          </ClayButton>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="peach" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Meeting link</h2>
          <MeetingLinkForm
            classId={classItem.id}
            defaultLink={classItem.meeting_link ?? ""}
          />
        </ClayCard>

        <ClayCard color="mint" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Students</h2>
          <ul className="space-y-2">
            {students.map((s) => (
              <li
                key={s.id}
                className="clay-sm rounded-2xl bg-[#FFFAF3]/8 px-3 py-2 text-sm font-bold text-ink"
              >
                {s.full_name}
                {s.phone ? (
                  <span className="mt-0.5 block text-[11px] font-semibold text-ink-muted">
                    {s.phone}
                  </span>
                ) : null}
              </li>
            ))}
            {!students.length ? (
              <li className="text-sm font-semibold text-ink-muted">
                No students enrolled yet — use the form below.
              </li>
            ) : null}
          </ul>
        </ClayCard>
      </div>

      <CreateStudentForm
        classes={[{ id: classItem.id, title: classItem.title }]}
        defaultClassId={classItem.id}
      />

      <ClayCard color="sky" className="p-5 sm:p-6">
        <h2 className="mb-1 text-lg font-black text-ink">
          After class — recording & notes
        </h2>
        <p className="mb-4 text-sm font-semibold text-ink-muted">
          Students will see the recording on their Recordings page.
        </p>
        <SessionForm classId={classItem.id} classTitle={classItem.title} />
      </ClayCard>

      <ClayCard color="white" className="p-5 sm:p-6">
        <h2 className="mb-3 text-lg font-black text-ink">Past sessions</h2>
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/teacher/sessions/${s.id}`}
                className="clay-sm flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-ink hover:brightness-95"
              >
                <span>
                  {new Date(`${s.session_date}T00:00:00`).toLocaleDateString()}
                  {s.recording_url ? " · recording" : ""}
                </span>
                <span className="text-xs text-ink-muted">Attendance →</span>
              </Link>
            </li>
          ))}
          {!sessions.length ? (
            <li className="text-sm font-semibold text-ink-muted">
              No sessions logged yet.
            </li>
          ) : null}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <ClayButton href={`/teacher/quizzes/new?classId=${classItem.id}`} variant="peach">
            Build quiz
          </ClayButton>
          <ClayButton href="/teacher/announcements" variant="outline">
            Announce to class
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
