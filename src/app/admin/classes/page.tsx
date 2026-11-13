import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClassForm } from "@/components/admin/class-form";
import {
  getAdminClasses,
  getAdminCourses,
  getProfilesByRole,
} from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Classes",
  robots: { index: false, follow: false },
};

export default function AdminClassesPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <ClassesContent />
    </Suspense>
  );
}

async function ClassesContent() {
  await connection();
  const [classes, courses, teachers] = await Promise.all([
    getAdminClasses(),
    getAdminCourses(),
    getProfilesByRole("teacher"),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Classes</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Assign teacher, set Meet/Zoom link, then enroll students on the class
          page.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="sky" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">New class</h2>
          <ClassForm courses={courses} teachers={teachers} />
        </ClayCard>

        <div className="space-y-3">
          {classes.map((c, i) => {
            const colors = ["peach", "mint", "yellow", "sky"] as const;
            return (
              <Link key={c.id} href={`/admin/classes/${c.id}`}>
                <ClayCard
                  color={colors[i % colors.length]}
                  className="p-5 transition-transform hover:-translate-y-0.5"
                >
                  <h2 className="text-lg font-black text-ink">{c.title}</h2>
                  <p className="text-sm font-semibold text-ink-muted">
                    {c.course_title} · Teacher: {c.teacher_name || "—"}
                  </p>
                  <p className="mt-1 text-xs font-bold text-ink">
                    {c.student_count} students ·{" "}
                    {c.platform === "zoom" ? "Zoom" : "Meet"} ·{" "}
                    {c.schedule_days.join(", ") || "Days TBD"}
                  </p>
                </ClayCard>
              </Link>
            );
          })}
          {!classes.length ? (
            <ClayCard color="white" className="p-6">
              <p className="font-extrabold text-ink">No classes yet</p>
            </ClayCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
