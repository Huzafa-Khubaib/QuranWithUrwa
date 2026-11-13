import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { PublishQuizButton } from "@/components/teacher/publish-quiz-button";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getTeacherQuizzes } from "@/lib/teacher/data";

export const metadata: Metadata = {
  title: "Quizzes",
  robots: { index: false, follow: false },
};

export default function TeacherQuizzesPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <QuizzesContent />
    </Suspense>
  );
}

async function QuizzesContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const quizzes = await getTeacherQuizzes(profile.id);
  const colors = ["peach", "mint", "yellow", "sky"] as const;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">Quizzes</h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Build colorful quizzes and review student results.
          </p>
        </div>
        <ClayButton href="/teacher/quizzes/new" variant="primary">
          New quiz
        </ClayButton>
      </div>

      {!quizzes.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <p className="font-extrabold text-ink">No quizzes yet</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Create one with 4 options, a correct answer, and an explanation.
          </p>
        </ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((q, i) => (
            <ClayCard key={q.id} color={colors[i % colors.length]} className="p-5 sm:p-6">
              <p className="text-xs font-extrabold tracking-wide text-ink/60 uppercase">
                {q.class_title}
              </p>
              <h2 className="mt-1 text-xl font-black text-ink">{q.title}</h2>
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                {q.question_count} questions · {q.attempt_count} attempts ·{" "}
                {q.is_published ? "Published" : "Draft"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ClayButton href={`/teacher/quizzes/${q.id}/results`} variant="outline">
                  Results
                </ClayButton>
                <PublishQuizButton quizId={q.id} isPublished={q.is_published} />
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
