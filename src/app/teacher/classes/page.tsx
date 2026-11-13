import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getTeacherClasses } from "@/lib/teacher/data";
import { formatTimeLabel } from "@/lib/student/schedule";

export const metadata: Metadata = {
  title: "My Classes",
  robots: { index: false, follow: false },
};

export default function TeacherClassesPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <ClassesContent />
    </Suspense>
  );
}

async function ClassesContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const classes = await getTeacherClasses(profile.id);
  const colors = ["peach", "mint", "yellow", "sky"] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">My Classes</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Classes assigned to you by the academy admin.
        </p>
      </div>

      {!classes.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <p className="font-extrabold text-ink">No classes yet</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Ask admin to create a class with you as teacher.
          </p>
        </ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((c, i) => (
            <Link key={c.id} href={`/teacher/classes/${c.id}`}>
              <ClayCard
                color={colors[i % colors.length]}
                className="h-full p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
              >
                <p className="text-xs font-extrabold tracking-wide text-ink/60 uppercase">
                  {c.course_title ?? "Course"}
                </p>
                <h2 className="mt-1 text-xl font-black text-ink">{c.title}</h2>
                <p className="mt-2 text-sm font-semibold text-ink-muted">
                  {c.schedule_days.join(", ") || "Days TBD"} ·{" "}
                  {formatTimeLabel(c.start_time)}
                </p>
                <p className="mt-1 text-sm font-extrabold text-ink">
                  {c.student_count} students ·{" "}
                  {c.platform === "zoom" ? "Zoom" : "Meet"}
                </p>
              </ClayCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
