"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getStudentClasses } from "@/lib/student/data";

const submitSchema = z.object({
  quizId: z.string().uuid(),
  answers: z.record(z.string(), z.string()),
});

export async function submitQuizAttemptAction(input: {
  quizId: string;
  answers: Record<string, string>;
}): Promise<
  | { ok: true; score: number; maxScore: number }
  | { ok: false; error: string }
> {
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "student") {
    return { ok: false, error: "Not authorized." };
  }

  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid quiz submission." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { ok: false, error: "Supabase is not configured." };
  }

  // Ensure quiz belongs to an enrolled, published class
  const classes = await getStudentClasses(profile.id);
  const classIds = classes.map((c) => c.id);

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, class_id, is_published")
    .eq("id", parsed.data.quizId)
    .maybeSingle();

  if (
    !quiz ||
    !quiz.is_published ||
    !classIds.includes(quiz.class_id)
  ) {
    return { ok: false, error: "Quiz not found." };
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("id, correct_answer, points")
    .eq("quiz_id", parsed.data.quizId);

  const list = questions ?? [];
  let score = 0;
  let maxScore = 0;
  for (const q of list) {
    maxScore += q.points;
    if (parsed.data.answers[q.id] === q.correct_answer) {
      score += q.points;
    }
  }

  const { error } = await supabase.from("quiz_attempts").upsert(
    {
      quiz_id: parsed.data.quizId,
      student_id: profile.id,
      answers: parsed.data.answers,
      score,
      max_score: maxScore,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "quiz_id,student_id" }
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, score, maxScore };
}
