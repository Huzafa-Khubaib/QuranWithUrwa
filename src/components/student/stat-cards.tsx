import {
  CheckCircle2,
  Flame,
  Percent,
  School,
} from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import type { StudentStats } from "@/lib/student/types";

const cards = [
  {
    key: "classesAttended" as const,
    label: "Classes attended",
    color: "mint" as const,
    icon: School,
    suffix: "",
  },
  {
    key: "quizzesPassed" as const,
    label: "Quizzes passed",
    color: "peach" as const,
    icon: CheckCircle2,
    suffix: "",
  },
  {
    key: "attendancePercent" as const,
    label: "Attendance",
    color: "yellow" as const,
    icon: Percent,
    suffix: "%",
  },
  {
    key: "streakDays" as const,
    label: "Day streak",
    color: "sky" as const,
    icon: Flame,
    suffix: "",
  },
];

export function StatCards({ stats }: { stats: StudentStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <ClayCard key={card.key} color={card.color} className="p-4 sm:p-5">
          <span className="clay-sm mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-[#FFFAF3]/85">
            <card.icon className="size-5 text-ink" aria-hidden />
          </span>
          <p className="text-3xl font-black tracking-tight text-ink">
            {stats[card.key]}
            {card.suffix}
          </p>
          <p className="mt-1 text-xs font-extrabold text-ink-muted">{card.label}</p>
        </ClayCard>
      ))}
    </div>
  );
}
