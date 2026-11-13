import { createClient } from "@/lib/supabase/server";
import { getNextClass } from "@/lib/student/schedule";
import type { StudentClass } from "@/lib/student/types";
import type {
  QuizResultRow,
  TeacherClass,
  TeacherQuizSummary,
  TeacherSession,
  TeacherStudent,
  TodayClassSlot,
} from "@/lib/teacher/types";

async function getClient() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export async function getTeacherClasses(
  teacherId: string
): Promise<TeacherClass[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data: classes } = await supabase
    .from("classes")
    .select(
      `
      id,
      title,
      platform,
      meeting_link,
      schedule_days,
      start_time,
      duration_minutes,
      courses ( title )
    `
    )
    .eq("teacher_id", teacherId)
    .eq("is_active", true)
    .order("title");

  if (!classes?.length) return [];

  const ids = classes.map((c) => c.id);
  const { data: links } = await supabase
    .from("class_students")
    .select("class_id")
    .in("class_id", ids);

  const countByClass: Record<string, number> = {};
  for (const link of links ?? []) {
    countByClass[link.class_id] = (countByClass[link.class_id] ?? 0) + 1;
  }

  return classes.map((c) => {
    const course = Array.isArray(c.courses) ? c.courses[0] : c.courses;
    return {
      id: c.id,
      title: c.title,
      platform: c.platform === "zoom" ? "zoom" : "meet",
      meeting_link: c.meeting_link,
      schedule_days: c.schedule_days ?? [],
      start_time: c.start_time,
      duration_minutes: c.duration_minutes ?? 45,
      course_title: course?.title ?? null,
      student_count: countByClass[c.id] ?? 0,
    };
  });
}

export async function getTeacherClass(
  teacherId: string,
  classId: string
): Promise<TeacherClass | null> {
  const classes = await getTeacherClasses(teacherId);
  return classes.find((c) => c.id === classId) ?? null;
}

export async function getTeacherStudents(
  teacherId: string
): Promise<TeacherStudent[]> {
  const classes = await getTeacherClasses(teacherId);
  if (!classes.length) return [];

  const supabase = await getClient();
  if (!supabase) return [];

  const classIds = classes.map((c) => c.id);
  const titleById = Object.fromEntries(classes.map((c) => [c.id, c.title]));

  const { data: links } = await supabase
    .from("class_students")
    .select("class_id, student_id")
    .in("class_id", classIds);

  if (!links?.length) return [];

  const studentIds = [...new Set(links.map((l) => l.student_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url")
    .in("id", studentIds);

  const map = new Map<string, TeacherStudent>();
  for (const p of profiles ?? []) {
    map.set(p.id, {
      id: p.id,
      full_name: p.full_name,
      phone: p.phone,
      avatar_url: p.avatar_url,
      class_ids: [],
      class_titles: [],
    });
  }

  for (const link of links) {
    const student = map.get(link.student_id);
    if (!student) continue;
    student.class_ids.push(link.class_id);
    student.class_titles.push(titleById[link.class_id] ?? "Class");
  }

  return [...map.values()].sort((a, b) =>
    a.full_name.localeCompare(b.full_name)
  );
}

export async function getClassStudents(
  teacherId: string,
  classId: string
): Promise<TeacherStudent[]> {
  const owned = await getTeacherClass(teacherId, classId);
  if (!owned) return [];
  const all = await getTeacherStudents(teacherId);
  return all.filter((s) => s.class_ids.includes(classId));
}

export async function getTodaySchedule(
  teacherId: string
): Promise<TodayClassSlot[]> {
  const classes = await getTeacherClasses(teacherId);
  const asStudentShape: StudentClass[] = classes.map((c) => ({
    id: c.id,
    title: c.title,
    platform: c.platform,
    meeting_link: c.meeting_link,
    schedule_days: c.schedule_days,
    start_time: c.start_time,
    duration_minutes: c.duration_minutes,
    course_title: c.course_title,
    teacher_name: null,
  }));

  const today = new Date();
  const day = today.getDay();
  const slots: TodayClassSlot[] = [];

  for (const classItem of classes) {
    const matchesToday = classItem.schedule_days.some((d) => {
      const key = d.trim().toLowerCase();
      const map: Record<string, number> = {
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
      return map[key] === day;
    });
    if (!matchesToday) continue;

    const [h, m] = (classItem.start_time ?? "09:00").split(":").map(Number);
    const startsAt = new Date(today);
    startsAt.setHours(h || 9, m || 0, 0, 0);
    slots.push({ classItem, startsAt });
  }

  // Also surface the global next class if nothing today but something soon
  if (!slots.length) {
    const next = getNextClass(asStudentShape);
    if (next) {
      const match = classes.find((c) => c.id === next.classItem.id);
      if (match) slots.push({ classItem: match, startsAt: next.startsAt });
    }
  }

  return slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export async function getTeacherSessions(
  teacherId: string,
  classId?: string
): Promise<TeacherSession[]> {
  const classes = await getTeacherClasses(teacherId);
  const filtered = classId
    ? classes.filter((c) => c.id === classId)
    : classes;
  if (!filtered.length) return [];

  const supabase = await getClient();
  if (!supabase) return [];

  const ids = filtered.map((c) => c.id);
  const titleById = Object.fromEntries(filtered.map((c) => [c.id, c.title]));

  const { data } = await supabase
    .from("sessions")
    .select("id, class_id, session_date, recording_url, notes")
    .in("class_id", ids)
    .order("session_date", { ascending: false });

  return (data ?? []).map((s) => ({
    id: s.id,
    class_id: s.class_id,
    class_title: titleById[s.class_id] ?? "Class",
    session_date: s.session_date,
    recording_url: s.recording_url,
    notes: s.notes,
  }));
}

export async function getTeacherSession(
  teacherId: string,
  sessionId: string
): Promise<TeacherSession | null> {
  const sessions = await getTeacherSessions(teacherId);
  return sessions.find((s) => s.id === sessionId) ?? null;
}

export async function getSessionAttendance(
  teacherId: string,
  sessionId: string
): Promise<Array<{ student_id: string; full_name: string; present: boolean }>> {
  const session = await getTeacherSession(teacherId, sessionId);
  if (!session) return [];

  const students = await getClassStudents(teacherId, session.class_id);
  const supabase = await getClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("attendance")
    .select("student_id, present")
    .eq("session_id", sessionId);

  const presentMap = Object.fromEntries(
    (data ?? []).map((r) => [r.student_id, r.present])
  );

  return students.map((s) => ({
    student_id: s.id,
    full_name: s.full_name,
    present: Boolean(presentMap[s.id]),
  }));
}

export async function getTeacherQuizzes(
  teacherId: string
): Promise<TeacherQuizSummary[]> {
  const classes = await getTeacherClasses(teacherId);
  if (!classes.length) return [];

  const supabase = await getClient();
  if (!supabase) return [];

  const classIds = classes.map((c) => c.id);
  const titleById = Object.fromEntries(classes.map((c) => [c.id, c.title]));

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, class_id, title, description, is_published")
    .in("class_id", classIds)
    .order("created_at", { ascending: false });

  if (!quizzes?.length) return [];

  const quizIds = quizzes.map((q) => q.id);
  const { data: questions } = await supabase
    .from("questions")
    .select("quiz_id")
    .in("quiz_id", quizIds);
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_id")
    .in("quiz_id", quizIds);

  const qCount: Record<string, number> = {};
  for (const q of questions ?? []) {
    qCount[q.quiz_id] = (qCount[q.quiz_id] ?? 0) + 1;
  }
  const aCount: Record<string, number> = {};
  for (const a of attempts ?? []) {
    aCount[a.quiz_id] = (aCount[a.quiz_id] ?? 0) + 1;
  }

  return quizzes.map((q) => ({
    id: q.id,
    class_id: q.class_id,
    class_title: titleById[q.class_id] ?? "Class",
    title: q.title,
    description: q.description,
    is_published: q.is_published,
    question_count: qCount[q.id] ?? 0,
    attempt_count: aCount[q.id] ?? 0,
  }));
}

export async function getQuizResults(
  teacherId: string,
  quizId: string
): Promise<{ quiz: TeacherQuizSummary; results: QuizResultRow[] } | null> {
  const quizzes = await getTeacherQuizzes(teacherId);
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return null;

  const supabase = await getClient();
  if (!supabase) return { quiz, results: [] };

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("student_id, score, max_score, submitted_at")
    .eq("quiz_id", quizId)
    .order("submitted_at", { ascending: false });

  if (!attempts?.length) return { quiz, results: [] };

  const studentIds = attempts.map((a) => a.student_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", studentIds);

  const nameById = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.full_name])
  );

  return {
    quiz,
    results: attempts.map((a) => ({
      student_id: a.student_id,
      student_name: nameById[a.student_id] ?? "Student",
      score: a.score != null ? Number(a.score) : null,
      max_score: a.max_score != null ? Number(a.max_score) : null,
      submitted_at: a.submitted_at,
    })),
  };
}

export async function getQuizWithQuestions(teacherId: string, quizId: string) {
  const quizzes = await getTeacherQuizzes(teacherId);
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return null;

  const supabase = await getClient();
  if (!supabase) return { quiz, questions: [] as QuestionRow[] };

  const { data } = await supabase
    .from("questions")
    .select("id, prompt, options, correct_answer, explanation, points, sort_order")
    .eq("quiz_id", quizId)
    .order("sort_order", { ascending: true });

  return {
    quiz,
    questions: (data ?? []).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: normalizeOptions(q.options),
      correct_answer: q.correct_answer,
      explanation: q.explanation ?? "",
      points: q.points,
      sort_order: q.sort_order,
    })),
  };
}

export type QuestionRow = {
  id: string;
  prompt: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  sort_order: number;
};

function normalizeOptions(options: unknown): string[] {
  if (Array.isArray(options)) return options.map(String);
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return [];
    }
  }
  return [];
}
