import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { QuizBuilderForm } from "@/components/teacher/quiz-builder-form";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getTeacherClasses } from "@/lib/teacher/data";

export const metadata: Metadata = {
  title: "New Quiz",
  robots: { index: false, follow: false },
};

export default function NewQuizPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <NewQuizContent />
    </Suspense>
  );
}

async function NewQuizContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const classes = await getTeacherClasses(profile.id);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Quiz builder</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Add questions with 4 options, mark the correct answer, and optional
          explanation.
        </p>
      </div>
      <ClayCard color="white" className="p-5 sm:p-7">
        <QuizBuilderForm classes={classes} />
      </ClayCard>
    </div>
  );
}
