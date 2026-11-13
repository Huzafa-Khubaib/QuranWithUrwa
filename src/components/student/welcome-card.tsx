import { Sparkles } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { KidIllustration } from "@/components/shared/kid-illustration";
import { ClayButton } from "@/components/shared/clay-button";

export function WelcomeCard({ fullName }: { fullName: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] || "friend";

  return (
    <ClayCard
      color="peach"
      className="grid overflow-hidden md:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="p-6 sm:p-8">
        <span className="clay-sm mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFFAF3]/80 px-3 py-1 text-xs font-extrabold text-ink">
          <Sparkles className="size-3.5" aria-hidden />
          Student dashboard
        </span>
        <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Assalamu Alaikum, {firstName}
        </h1>
        <p className="font-arabic mt-1 text-xl text-ink/70" dir="rtl">
          السلام عليكم
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed font-semibold text-ink-muted sm:text-base">
          Ready for today’s lesson? Check your next class, revise with
          recordings, or try a quiz — soft and steady.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ClayButton href="/student/classes" variant="primary">
            My classes
          </ClayButton>
          <ClayButton href="/student/quizzes" variant="secondary">
            Take a quiz
          </ClayButton>
        </div>
      </div>
      <div className="flex items-end justify-center px-4 pb-2 pt-0 md:pt-4">
        <KidIllustration className="h-auto w-full max-w-[260px]" />
      </div>
    </ClayCard>
  );
}
