import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { CourseForm } from "@/components/admin/course-form";
import { getAdminCourses } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Courses",
  robots: { index: false, follow: false },
};

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <CoursesContent />
    </Suspense>
  );
}

async function CoursesContent() {
  await connection();
  const courses = await getAdminCourses();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Courses</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Catalog used when creating classes.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="peach" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Add course</h2>
          <CourseForm />
        </ClayCard>

        <div className="space-y-3">
          {courses.map((c) => (
            <ClayCard key={c.id} color="white" className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-ink">{c.title}</h2>
                  <p className="font-arabic text-sm text-ink-muted" dir="rtl">
                    {c.arabic_title}
                  </p>
                  <p className="text-xs font-bold text-ink-muted">
                    {c.slug} · {c.level || "Level n/a"} ·{" "}
                    {c.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <CourseForm course={c} />
            </ClayCard>
          ))}
          {!courses.length ? (
            <ClayCard color="mint" className="p-6">
              <p className="font-extrabold text-ink">No courses yet</p>
            </ClayCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
