export type TeacherClass = {
  id: string;
  title: string;
  platform: "meet" | "zoom";
  meeting_link: string | null;
  schedule_days: string[];
  start_time: string | null;
  duration_minutes: number;
  course_title: string | null;
  student_count: number;
};

export type TeacherStudent = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  class_ids: string[];
  class_titles: string[];
};

export type TeacherSession = {
  id: string;
  class_id: string;
  class_title: string;
  session_date: string;
  recording_url: string | null;
  notes: string | null;
};

export type TeacherQuizSummary = {
  id: string;
  class_id: string;
  class_title: string;
  title: string;
  description: string | null;
  is_published: boolean;
  question_count: number;
  attempt_count: number;
};

export type QuizResultRow = {
  student_id: string;
  student_name: string;
  score: number | null;
  max_score: number | null;
  submitted_at: string;
};

export type TodayClassSlot = {
  classItem: TeacherClass;
  startsAt: Date;
};
