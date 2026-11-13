import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClipboardList } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getStudentQuizzes } from "@/lib/student/data";

export const metadata: Metadata = {
  title: "Quizzes",
  robots: { index: false, follow: false },
};

export default function StudentQuizzesPage() {
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

  const quizzes = await getStudentQuizzes(profile.id);
  const colors = ["peach", "mint", "yellow", "sky"] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Quizzes</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          One question at a time — colorful answers, confetti, and your score saved.
        </p>
      </div>

      {!quizzes.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <ClipboardList className="mx-auto size-10 text-ink/25" aria-hidden />
          <p className="mt-3 font-extrabold text-ink">No quizzes yet</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Published quizzes from your classes will appear here.
          </p>
        </ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((q, i) => (
            <Link key={q.id} href={`/student/quizzes/${q.id}`} className="block">
              <ClayCard
                color={colors[i % colors.length]}
                className="h-full p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
              >
                <p className="text-xs font-extrabold tracking-wide text-ink/60 uppercase">
                  {q.class_title}
                </p>
                <h2 className="mt-1 text-xl font-black text-ink">{q.title}</h2>
                {q.description ? (
                  <p className="mt-2 text-sm font-semibold text-ink-muted">
                    {q.description}
                  </p>
                ) : null}
                <p className="mt-4 text-sm font-extrabold text-ink">
                  {q.attempt
                    ? `Score: ${q.attempt.score}/${q.attempt.max_score}`
                    : "Not attempted — tap to start"}
                </p>
              </ClayCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
