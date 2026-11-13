import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ClayCard } from "@/components/shared/clay-card";
import { ClassForm } from "@/components/admin/class-form";
import { ClassRosterForm } from "@/components/admin/class-roster-form";
import {
  getAdminClassDetail,
  getAdminCourses,
  getProfilesByRole,
} from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Edit Class",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default function AdminClassDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <ClassDetail params={params} />
    </Suspense>
  );
}

async function ClassDetail({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const detail = await getAdminClassDetail(id);
  if (!detail) notFound();

  const [courses, teachers, students] = await Promise.all([
    getAdminCourses(),
    getProfilesByRole("teacher"),
    getProfilesByRole("student"),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">
          {detail.classItem.title}
        </h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Update teacher, Meet/Zoom link, and student roster.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="peach" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Class settings</h2>
          <ClassForm
            classItem={detail.classItem}
            courses={courses}
            teachers={teachers}
          />
        </ClayCard>

        <ClayCard color="mint" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Assign students</h2>
          <ClassRosterForm
            classId={detail.classItem.id}
            students={students}
            selectedIds={detail.studentIds}
          />
        </ClayCard>
      </div>
    </div>
  );
}
