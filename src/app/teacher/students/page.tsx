import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Users } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { CreateStudentForm } from "@/components/teacher/create-student-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getTeacherClasses, getTeacherStudents } from "@/lib/teacher/data";

export const metadata: Metadata = {
  title: "My Students",
  robots: { index: false, follow: false },
};

export default function TeacherStudentsPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <StudentsContent />
    </Suspense>
  );
}

async function StudentsContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const [students, classes] = await Promise.all([
    getTeacherStudents(profile.id),
    getTeacherClasses(profile.id),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">My Students</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Create student logins and enroll them in your classes.
        </p>
      </div>

      <CreateStudentForm
        classes={classes.map((c) => ({ id: c.id, title: c.title }))}
      />

      {!students.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <Users className="mx-auto size-10 text-ink/25" aria-hidden />
          <p className="mt-3 font-extrabold text-ink">No students yet</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Use the form above to create a student account and add them to a
            class.
          </p>
        </ClayCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s, i) => {
            const colors = ["mint", "peach", "sky", "yellow"] as const;
            return (
              <ClayCard key={s.id} color={colors[i % colors.length]} className="p-5">
                <div className="clay-sm mb-3 flex size-12 items-center justify-center rounded-full bg-[#FFFAF3] text-lg font-black text-ink">
                  {s.full_name.slice(0, 1).toUpperCase()}
                </div>
                <h2 className="text-lg font-black text-ink">{s.full_name}</h2>
                <p className="mt-1 text-xs font-bold text-ink-muted">
                  {s.phone || "No phone"}
                </p>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-ink">
                  {s.class_titles.join(" · ")}
                </p>
              </ClayCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
