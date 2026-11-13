export type StudentClass = {
  id: string;
  title: string;
  platform: "meet" | "zoom";
  meeting_link: string | null;
  schedule_days: string[];
  start_time: string | null;
  duration_minutes: number;
  course_title: string | null;
  teacher_name: string | null;
};

export type StudentSession = {
  id: string;
  class_id: string;
  class_title: string;
  session_date: string;
  recording_url: string | null;
  notes: string | null;
};

export type StudentQuiz = {
  id: string;
  class_id: string;
  class_title: string;
  title: string;
  description: string | null;
  attempt: {
    score: number | null;
    max_score: number | null;
    submitted_at: string;
  } | null;
};

/** Public question payload for the player (no correct_answer). */
export type StudentQuestion = {
  id: string;
  prompt: string;
  options: string[];
  points: number;
  sort_order: number;
};

export type StudentAnnouncement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  audience: string;
};

export type StudentStats = {
  classesAttended: number;
  quizzesPassed: number;
  attendancePercent: number;
  streakDays: number;
};

export type NextClassInfo = {
  classItem: StudentClass;
  startsAt: Date;
} | null;

export type ScheduleSlot = {
  day: string;
  dayIndex: number;
  classes: Array<{
    id: string;
    title: string;
    start_time: string | null;
    platform: "meet" | "zoom";
  }>;
};
