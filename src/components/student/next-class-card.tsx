"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Timer, Video } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import type { StudentClass } from "@/lib/student/types";

type NextClassCardProps = {
  classItem: StudentClass;
  startsAtIso: string;
};

function formatCountdown(ms: number) {
  if (ms <= 0) return { label: "Starting now", live: true };
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return { label: `${d}d ${h}h ${m}m`, live: false };
  return {
    label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    live: false,
  };
}

export function NextClassCard({ classItem, startsAtIso }: NextClassCardProps) {
  const startsAt = useMemo(() => new Date(startsAtIso), [startsAtIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = startsAt.getTime() - now;
  const countdown = formatCountdown(remaining);
  const canJoin = Boolean(classItem.meeting_link);
  const withinWindow =
    remaining <= 15 * 60 * 1000 && remaining >= -classItem.duration_minutes * 60 * 1000;

  return (
    <ClayCard color="sky" className="flex h-full flex-col p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
          Next class
        </p>
        <span className="clay-sm inline-flex items-center gap-1 rounded-full bg-[#FFFAF3]/80 px-2.5 py-1 text-[11px] font-extrabold text-ink">
          <Timer className="size-3.5" aria-hidden />
          {countdown.label}
        </span>
      </div>

      <h3 className="text-xl font-black text-ink">{classItem.title}</h3>
      <p className="mt-1 text-sm font-semibold text-ink-muted">
        {classItem.course_title ?? "Quran class"} ·{" "}
        {classItem.platform === "zoom" ? "Zoom" : "Google Meet"}
        {classItem.teacher_name ? ` · ${classItem.teacher_name}` : ""}
      </p>
      <p className="mt-2 text-xs font-bold text-ink/60">
        {startsAt.toLocaleString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>

      <div className="mt-auto pt-5">
        {canJoin ? (
          <ClayButton
            href={classItem.meeting_link!}
            external
            variant={withinWindow || countdown.live ? "primary" : "outline"}
            size="lg"
            className="w-full text-base"
          >
            <Video className="size-5" aria-hidden />
            Join Class
            <ExternalLink className="size-4 opacity-70" aria-hidden />
          </ClayButton>
        ) : (
          <p className="rounded-2xl bg-[#FFFAF3]/70 px-4 py-3 text-center text-sm font-bold text-ink-muted">
            Meeting link will appear here when your teacher shares it.
          </p>
        )}
      </div>
    </ClayCard>
  );
}
