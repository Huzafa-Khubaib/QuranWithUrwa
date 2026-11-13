import { ClayCard } from "@/components/shared/clay-card";
import { formatTimeLabel } from "@/lib/student/schedule";
import type { ScheduleSlot } from "@/lib/student/types";
import { cn } from "@/lib/utils";

const slotColors = ["bg-peach/80", "bg-mint/80", "bg-soft-yellow/80", "bg-sky/80"];

export function WeeklySchedule({ slots }: { slots: ScheduleSlot[] }) {
  const today = new Date().getDay();

  return (
    <ClayCard color="white" className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-black text-ink">Weekly schedule</h3>
        <span className="text-xs font-bold text-ink-muted">Your classes</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {slots.map((slot, i) => (
          <div
            key={slot.day}
            className={cn(
              "clay-inset min-h-[110px] rounded-2xl p-2.5",
              slot.dayIndex === today ? "bg-mint/50 ring-2 ring-primary/20" : "bg-cream/70"
            )}
          >
            <p className="text-center text-[11px] font-extrabold tracking-wide text-ink uppercase">
              {slot.day}
            </p>
            <div className="mt-2 space-y-1.5">
              {slot.classes.length === 0 ? (
                <p className="text-center text-[10px] font-semibold text-ink/35">—</p>
              ) : (
                slot.classes.map((c, idx) => (
                  <div
                    key={`${c.id}-${idx}`}
                    className={cn(
                      "rounded-xl px-2 py-1.5 text-[10px] font-bold leading-tight text-ink",
                      slotColors[idx % slotColors.length]
                    )}
                  >
                    <p className="truncate">{c.title}</p>
                    <p className="opacity-70">{formatTimeLabel(c.start_time)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </ClayCard>
  );
}
