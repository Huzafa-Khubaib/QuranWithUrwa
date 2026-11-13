import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { WelcomeCard } from "@/components/student/welcome-card";
import { StatCards } from "@/components/student/stat-cards";
import { NextClassCard } from "@/components/student/next-class-card";
import { WeeklySchedule } from "@/components/student/weekly-schedule";
import { ClayCard } from "@/components/shared/clay-card";
import { PortalLoading } from "@/components/shared/portal-loading";
import { getSessionProfile } from "@/lib/auth/get-profile";
import {
  getStudentClasses,
  getStudentStats,
} from "@/lib/student/data";
import { buildWeeklySchedule, getNextClass } from "@/lib/student/schedule";

export const metadata: Metadata = {
  title: "Student Dashboard",
  robots: { index: false, follow: false },
};

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <StudentDashboard />
    </Suspense>
  );
}

async function StudentDashboard() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const [classes, stats] = await Promise.all([
    getStudentClasses(profile.id),
    getStudentStats(profile.id),
  ]);

  const next = getNextClass(classes);
  const schedule = buildWeeklySchedule(classes);

  return (
    <div className="space-y-4 sm:space-y-5">
      <WelcomeCard fullName={profile.full_name || "Student"} />
      <StatCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {next ? (
          <NextClassCard
            classItem={next.classItem}
            startsAtIso={next.startsAt.toISOString()}
          />
        ) : (
          <ClayCard color="sky" className="p-6">
            <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
              Next class
            </p>
            <h3 className="mt-2 text-xl font-black text-ink">Nothing scheduled</h3>
            <p className="mt-2 text-sm font-semibold text-ink-muted">
              When you’re enrolled in a class with schedule days, your next
              Meet/Zoom session will show a Join button and countdown here.
            </p>
          </ClayCard>
        )}

        <ClayCard color="yellow" className="p-6">
          <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
            My classes
          </p>
          <p className="mt-2 text-3xl font-black text-ink">{classes.length}</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Active enrollments visible only to you.
          </p>
          <ul className="mt-4 space-y-2">
            {classes.slice(0, 4).map((c) => (
              <li
                key={c.id}
                className="clay-sm rounded-2xl bg-[#FFFAF3]/75 px-3 py-2 text-sm font-bold text-ink"
              >
                {c.title}
                <span className="mt-0.5 block text-[11px] font-semibold text-ink-muted">
                  {c.course_title ?? "Course"} ·{" "}
                  {c.platform === "zoom" ? "Zoom" : "Meet"}
                </span>
              </li>
            ))}
            {!classes.length ? (
              <li className="text-sm font-semibold text-ink-muted">
                No classes yet — your admin will enroll you soon.
              </li>
            ) : null}
          </ul>
        </ClayCard>
      </div>

      <WeeklySchedule slots={schedule} />
    </div>
  );
}
