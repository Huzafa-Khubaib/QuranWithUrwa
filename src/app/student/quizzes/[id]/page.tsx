import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/student/quiz-player";
import { ClayButton } from "@/components/shared/clay-button";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getQuizForStudent } from "@/lib/student/data";

export const metadata: Metadata = {
  title: "Take Quiz",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function StudentQuizPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading quiz…</p>}>
      <QuizContent params={params} />
    </Suspense>
  );
}

async function QuizContent({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const data = await getQuizForStudent(profile.id, id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink">{data.quiz.title}</h1>
          <p className="text-sm font-semibold text-ink-muted">
            {data.quiz.class_title}
          </p>
        </div>
        <ClayButton href="/student/quizzes" variant="outline">
          Exit
        </ClayButton>
      </div>
      <QuizPlayer quiz={data.quiz} questions={data.questions} />
    </div>
  );
}
