"use client";

import { useState, useTransition } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { submitQuizAttemptAction } from "@/lib/student/quiz-actions";
import type { StudentQuestion, StudentQuiz } from "@/lib/student/types";
import { cn } from "@/lib/utils";

const optionColors = [
  "bg-peach hover:brightness-105",
  "bg-mint hover:brightness-105",
  "bg-soft-yellow hover:brightness-105",
  "bg-sky hover:brightness-105",
];

type QuizPlayerProps = {
  quiz: StudentQuiz;
  questions: StudentQuestion[];
};

export function QuizPlayer({ quiz, questions }: QuizPlayerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(Boolean(quiz.attempt));
  const [score, setScore] = useState(quiz.attempt?.score ?? 0);
  const [maxScore, setMaxScore] = useState(quiz.attempt?.max_score ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const question = questions[index];

  function celebrate() {
    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#F8C9B5", "#BFE0D0", "#FBE7A8", "#BFD7EA", "#5C8F7A"],
    });
  }

  function finish(finalAnswers: Record<string, string>) {
    startTransition(async () => {
      const result = await submitQuizAttemptAction({
        quizId: quiz.id,
        answers: finalAnswers,
      });

      if (!result.ok) {
        setError(result.error);
        setDone(true);
        return;
      }

      setScore(result.score);
      setMaxScore(result.maxScore);
      setDone(true);
      celebrate();
    });
  }

  function onPick(option: string) {
    if (!question || locked || done || pending) return;
    setSelected(option);
    setLocked(true);

    const nextAnswers = { ...answers, [question.id]: option };
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (index >= questions.length - 1) {
        finish(nextAnswers);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
        setLocked(false);
      }
    }, 450);
  }

  if (!questions.length) {
    return (
      <ClayCard color="white" className="p-8 text-center">
        <p className="font-extrabold text-ink">No questions in this quiz yet.</p>
      </ClayCard>
    );
  }

  if (done) {
    const pct =
      maxScore > 0 ? Math.round((Number(score) / Number(maxScore)) * 100) : 0;
    return (
      <ClayCard color="mint" className="p-8 text-center sm:p-10">
        <PartyPopper className="mx-auto size-12 text-ink" aria-hidden />
        <h2 className="mt-3 text-2xl font-black text-ink">MashaAllah!</h2>
        <p className="mt-2 text-sm font-semibold text-ink-muted">
          You scored{" "}
          <span className="font-black text-ink">
            {score}/{maxScore}
          </span>{" "}
          ({pct}%) on {quiz.title}.
        </p>
        {error ? (
          <p className="mt-3 text-sm font-bold text-red-700">{error}</p>
        ) : (
          <p className="mt-3 text-xs font-bold text-ink/50">
            {pending ? "Saving your score…" : "Score saved to your portal."}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <ClayButton href="/student/quizzes" variant="primary">
            Back to quizzes
          </ClayButton>
          <ClayButton href="/student" variant="outline">
            Dashboard
          </ClayButton>
        </div>
      </ClayCard>
    );
  }

  return (
    <ClayCard color="white" className="overflow-hidden p-5 sm:p-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
          {quiz.class_title}
        </p>
        <p className="text-xs font-extrabold text-ink">
          {index + 1} / {questions.length}
        </p>
      </div>

      <div className="clay-inset mb-6 h-2 overflow-hidden rounded-full bg-cream">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${((index + (locked ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-black text-ink sm:text-2xl">
            {question.prompt}
          </h2>
          <p className="mt-1 text-xs font-bold text-ink-muted">
            {question.points} point{question.points === 1 ? "" : "s"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => (
              <button
                key={option}
                type="button"
                disabled={locked || pending}
                onClick={() => onPick(option)}
                className={cn(
                  "clay rounded-3xl px-4 py-4 text-left text-sm font-extrabold text-ink transition-transform active:scale-[0.98] disabled:cursor-default",
                  optionColors[i % optionColors.length],
                  selected === option && "ring-2 ring-primary"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </ClayCard>
  );
}
