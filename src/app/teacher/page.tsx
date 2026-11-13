import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ExternalLink, Video } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { PortalLoading } from "@/components/shared/portal-loading";
import { SessionForm } from "@/components/teacher/session-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import {
  getTeacherClasses,
  getTeacherStudents,
  getTodaySchedule,
} from "@/lib/teacher/data";
import { formatTimeLabel } from "@/lib/student/schedule";

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  robots: { index: false, follow: false },
};

export default function TeacherDashboardPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <TeacherDashboard />
    </Suspense>
  );
}

async function TeacherDashboard() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const [classes, students, today] = await Promise.all([
    getTeacherClasses(profile.id),
    getTeacherStudents(profile.id),
    getTodaySchedule(profile.id),
  ]);

  const firstToday = today[0];

  return (
    <div className="space-y-5">
      <ClayCard color="peach" className="p-6 sm:p-8">
        <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
          Assalamu alaikum
        </p>
        <h1 className="mt-1 text-3xl font-black text-ink">
          {profile.full_name || "Teacher"}
        </h1>
        <p className="mt-2 max-w-xl text-sm font-semibold text-ink-muted">
          Start today’s class, log recordings, mark attendance, and build quizzes
          for your students.
        </p>
      </ClayCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <ClayCard color="mint" className="p-5">
          <p className="text-3xl font-black text-ink">{classes.length}</p>
          <p className="text-xs font-extrabold text-ink-muted">My classes</p>
        </ClayCard>
        <ClayCard color="sky" className="p-5">
          <p className="text-3xl font-black text-ink">{students.length}</p>
          <p className="text-xs font-extrabold text-ink-muted">My students</p>
        </ClayCard>
        <ClayCard color="yellow" className="p-5">
          <p className="text-3xl font-black text-ink">{today.length}</p>
          <p className="text-xs font-extrabold text-ink-muted">On schedule today</p>
        </ClayCard>
      </div>

      <ClayCard color="white" className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-black text-ink">Today’s schedule</h2>
          <Link
            href="/teacher/classes"
            className="text-xs font-extrabold text-ink-muted underline-offset-2 hover:underline"
          >
            All classes
          </Link>
        </div>

        {!today.length ? (
          <p className="text-sm font-semibold text-ink-muted">
            No classes scheduled for today. When a class has schedule days set,
            it will appear here with a Start Class button.
          </p>
        ) : (
          <div className="space-y-3">
            {today.map(({ classItem, startsAt }) => (
              <div
                key={`${classItem.id}-${startsAt.toISOString()}`}
                className="clay-sm flex flex-col gap-3 rounded-3xl bg-cream p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-extrabold text-ink">{classItem.title}</p>
                  <p className="text-xs font-bold text-ink-muted">
                    {startsAt.toLocaleString([], {
                      weekday: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {formatTimeLabel(classItem.start_time)} ·{" "}
                    {classItem.platform === "zoom" ? "Zoom" : "Google Meet"} ·{" "}
                    {classItem.student_count} students
                  </p>
                </div>
                {classItem.meeting_link ? (
                  <ClayButton
                    href={classItem.meeting_link}
                    external
                    variant="primary"
                    size="lg"
                  >
                    <Video className="size-4" aria-hidden />
                    Start Class
                    <ExternalLink className="size-3.5 opacity-70" aria-hidden />
                  </ClayButton>
                ) : (
                  <ClayButton
                    href={`/teacher/classes/${classItem.id}`}
                    variant="outline"
                  >
                    Add meeting link
                  </ClayButton>
                )}
              </div>
            ))}
          </div>
        )}
      </ClayCard>

      {firstToday ? (
        <ClayCard color="sky" className="p-5 sm:p-6">
          <h2 className="text-lg font-black text-ink">After class — log session</h2>
          <p className="mt-1 mb-4 text-sm font-semibold text-ink-muted">
            Add today’s recording link and notes for {firstToday.classItem.title}.
          </p>
          <SessionForm
            classId={firstToday.classItem.id}
            classTitle={firstToday.classItem.title}
          />
        </ClayCard>
      ) : classes[0] ? (
        <ClayCard color="sky" className="p-5 sm:p-6">
          <h2 className="text-lg font-black text-ink">Log a session</h2>
          <p className="mt-1 mb-4 text-sm font-semibold text-ink-muted">
            Save a recording + notes for {classes[0].title}.
          </p>
          <SessionForm classId={classes[0].id} classTitle={classes[0].title} />
        </ClayCard>
      ) : null}
    </div>
  );
}
