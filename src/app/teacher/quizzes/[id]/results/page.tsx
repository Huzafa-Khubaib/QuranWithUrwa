import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { PublishQuizButton } from "@/components/teacher/publish-quiz-button";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getQuizResults, getQuizWithQuestions } from "@/lib/teacher/data";

export const metadata: Metadata = {
  title: "Quiz Results",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default function QuizResultsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <ResultsContent params={params} />
    </Suspense>
  );
}

async function ResultsContent({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const [bundle, withQuestions] = await Promise.all([
    getQuizResults(profile.id, id),
    getQuizWithQuestions(profile.id, id),
  ]);

  if (!bundle) notFound();

  const { quiz, results } = bundle;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
            {quiz.class_title}
          </p>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">{quiz.title}</h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {quiz.question_count} questions ·{" "}
            {quiz.is_published ? "Published" : "Draft"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PublishQuizButton quizId={quiz.id} isPublished={quiz.is_published} />
          <ClayButton href="/teacher/quizzes" variant="outline">
            All quizzes
          </ClayButton>
        </div>
      </div>

      <ClayCard color="mint" className="p-5 sm:p-6">
        <h2 className="mb-3 text-lg font-black text-ink">Student results</h2>
        {!results.length ? (
          <p className="text-sm font-semibold text-ink-muted">
            No attempts yet. Publish the quiz so students can take it.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
                  <th className="pb-2 pr-3">Student</th>
                  <th className="pb-2 pr-3">Score</th>
                  <th className="pb-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.student_id} className="border-t border-ink/5">
                    <td className="py-3 pr-3 font-extrabold text-ink">
                      {r.student_name}
                    </td>
                    <td className="py-3 pr-3 font-bold text-ink">
                      {r.score}/{r.max_score}
                    </td>
                    <td className="py-3 text-ink-muted">
                      {new Date(r.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ClayCard>

      {withQuestions?.questions.length ? (
        <ClayCard color="white" className="p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-ink">Answer key</h2>
          <ul className="space-y-3">
            {withQuestions.questions.map((q, i) => (
              <li key={q.id} className="clay-inset rounded-2xl bg-cream p-4">
                <p className="text-sm font-extrabold text-ink">
                  {i + 1}. {q.prompt}
                </p>
                <p className="mt-1 text-xs font-bold text-primary">
                  Correct: {q.correct_answer}
                </p>
                {q.explanation ? (
                  <p className="mt-1 text-xs font-semibold text-ink-muted">
                    {q.explanation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </ClayCard>
      ) : null}
    </div>
  );
}
