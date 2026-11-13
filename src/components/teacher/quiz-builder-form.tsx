"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { createQuizAction, type ActionState } from "@/lib/teacher/actions";
import type { TeacherClass } from "@/lib/teacher/types";

const initial: ActionState = {};

type QuestionDraft = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

function emptyQuestion(): QuestionDraft {
  return {
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  };
}

export function QuizBuilderForm({ classes }: { classes: TeacherClass[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createQuizAction, initial);
  useActionToast(state);
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);

  useEffect(() => {
    if (state.id) router.push(`/teacher/quizzes/${state.id}/results`);
  }, [state.id, router]);

  function updateQuestion(index: number, patch: Partial<QuestionDraft>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    );
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options] as QuestionDraft["options"];
        options[optIndex] = value;
        return { ...q, options };
      })
    );
  }

  const questionsJson = JSON.stringify(
    questions.map((q) => ({
      prompt: q.prompt,
      options: q.options,
      correct: q.options[q.correctIndex],
      explanation: q.explanation,
    }))
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="questionsJson" value={questionsJson} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Class
          </span>
          <select
            name="classId"
            required
            defaultValue=""
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="" disabled>
              Select class
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Quiz title
          </span>
          <input
            name="title"
            required
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Description
          </span>
          <textarea
            name="description"
            rows={2}
            className="clay-inset w-full resize-none rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div
            key={qi}
            className="clay rounded-3xl border border-white/50 bg-[#FFFAF3] p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-extrabold text-ink">Question {qi + 1}</p>
              {questions.length > 1 ? (
                <button
                  type="button"
                  className="text-ink-muted hover:text-ink"
                  onClick={() =>
                    setQuestions((prev) => prev.filter((_, i) => i !== qi))
                  }
                  aria-label="Remove question"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>

            <input
              value={q.prompt}
              onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
              placeholder="Question prompt"
              className="clay-inset mb-3 w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
            />

            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className="clay-inset flex items-center gap-2 rounded-2xl bg-cream px-3 py-2"
                >
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, { correctIndex: oi })}
                    className="accent-primary"
                  />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    placeholder={`Option ${oi + 1}`}
                    className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-bold text-ink-muted">
              Select the radio next to the correct option.
            </p>

            <textarea
              value={q.explanation}
              onChange={(e) =>
                updateQuestion(qi, { explanation: e.target.value })
              }
              rows={2}
              placeholder="Explanation (optional — for you / review)"
              className="clay-inset mt-3 w-full resize-none rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
      </div>

      <ClayButton
        type="button"
        variant="mint"
        onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
      >
        <Plus className="size-4" aria-hidden />
        Add question
      </ClayButton>

      <label className="flex items-center gap-2 text-sm font-bold text-ink">
        <input type="checkbox" name="publish" className="size-4 accent-primary" />
        Publish immediately for students
      </label>

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}

      <ClayButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending || !classes.length}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Creating…
          </>
        ) : (
          "Create quiz"
        )}
      </ClayButton>
    </form>
  );
}
