import type { NextClassInfo, ScheduleSlot, StudentClass } from "@/lib/student/types";

const DAY_ALIASES: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function normalizeDayIndex(value: string): number | null {
  const key = value.trim().toLowerCase();
  if (key in DAY_ALIASES) return DAY_ALIASES[key];
  // numeric 0-6
  const n = Number(key);
  if (Number.isInteger(n) && n >= 0 && n <= 6) return n;
  return null;
}

function parseStartTime(startTime: string | null): { h: number; m: number } {
  if (!startTime) return { h: 9, m: 0 };
  const [h, m] = startTime.split(":").map((p) => Number(p));
  return {
    h: Number.isFinite(h) ? h : 9,
    m: Number.isFinite(m) ? m : 0,
  };
}

export function getNextClass(classes: StudentClass[], from = new Date()): NextClassInfo {
  let best: NextClassInfo = null;

  for (const classItem of classes) {
    if (!classItem.schedule_days?.length) continue;
    const { h, m } = parseStartTime(classItem.start_time);

    for (let offset = 0; offset < 14; offset++) {
      const candidate = new Date(from);
      candidate.setSeconds(0, 0);
      candidate.setDate(from.getDate() + offset);
      candidate.setHours(h, m, 0, 0);

      const dayOk = classItem.schedule_days.some((d) => {
        const idx = normalizeDayIndex(d);
        return idx !== null && idx === candidate.getDay();
      });

      if (!dayOk) continue;
      if (candidate.getTime() <= from.getTime()) continue;

      if (!best || candidate < best.startsAt) {
        best = { classItem, startsAt: candidate };
      }
      break;
    }
  }

  return best;
}

export function buildWeeklySchedule(classes: StudentClass[]): ScheduleSlot[] {
  return DAY_LABELS.map((day, dayIndex) => ({
    day,
    dayIndex,
    classes: classes
      .filter((c) =>
        c.schedule_days.some((d) => normalizeDayIndex(d) === dayIndex)
      )
      .map((c) => ({
        id: c.id,
        title: c.title,
        start_time: c.start_time,
        platform: c.platform,
      }))
      .sort((a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? "")),
  }));
}

export function formatTimeLabel(startTime: string | null) {
  if (!startTime) return "TBD";
  const { h, m } = parseStartTime(startTime);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
