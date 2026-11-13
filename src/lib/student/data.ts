import { createClient } from "@/lib/supabase/server";
import type {
  StudentAnnouncement,
  StudentClass,
  StudentQuestion,
  StudentQuiz,
  StudentSession,
  StudentStats,
} from "@/lib/student/types";

async function getClient() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export async function getStudentClasses(studentId: string): Promise<StudentClass[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data: links, error } = await supabase
    .from("class_students")
    .select("class_id")
    .eq("student_id", studentId);

  if (error || !links?.length) return [];

  const classIds = links.map((l) => l.class_id);
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
      courses ( title ),
      profiles:teacher_id ( full_name )
    `
    )
    .in("id", classIds)
    .eq("is_active", true);

  return (classes ?? []).map((c) => {
    const course = Array.isArray(c.courses) ? c.courses[0] : c.courses;
    const teacher = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
    return {
      id: c.id,
      title: c.title,
      platform: c.platform === "zoom" ? "zoom" : "meet",
      meeting_link: c.meeting_link,
      schedule_days: c.schedule_days ?? [],
      start_time: c.start_time,
      duration_minutes: c.duration_minutes ?? 45,
      course_title: course?.title ?? null,
      teacher_name: teacher?.full_name ?? null,
    };
  });
}

export async function getStudentSessions(
  studentId: string
): Promise<StudentSession[]> {
  const classes = await getStudentClasses(studentId);
  if (!classes.length) return [];

  const supabase = await getClient();
  if (!supabase) return [];

  const classIds = classes.map((c) => c.id);
  const titleById = Object.fromEntries(classes.map((c) => [c.id, c.title]));

  const { data } = await supabase
    .from("sessions")
    .select("id, class_id, session_date, recording_url, notes")
    .in("class_id", classIds)
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

export async function getStudentStats(
  studentId: string
): Promise<StudentStats> {
  const supabase = await getClient();
  if (!supabase) {
    return {
      classesAttended: 0,
      quizzesPassed: 0,
      attendancePercent: 0,
      streakDays: 0,
    };
  }

  const sessions = await getStudentSessions(studentId);
  const sessionIds = sessions.map((s) => s.id);

  let classesAttended = 0;
  let attendancePercent = 0;
  let streakDays = 0;

  if (sessionIds.length) {
    const { data: attendance } = await supabase
      .from("attendance")
      .select("session_id, present, sessions(session_date)")
      .eq("student_id", studentId)
      .in("session_id", sessionIds);

    const rows = attendance ?? [];
    const present = rows.filter((r) => r.present).length;
    classesAttended = present;
    attendancePercent = rows.length
      ? Math.round((present / rows.length) * 100)
      : 0;

    const presentDates = rows
      .filter((r) => r.present)
      .map((r) => {
        const sess = Array.isArray(r.sessions) ? r.sessions[0] : r.sessions;
        return sess?.session_date as string | undefined;
      })
      .filter(Boolean)
      .sort()
      .reverse() as string[];

    streakDays = computeStreak(presentDates);
  }

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("score, max_score")
    .eq("student_id", studentId);

  const quizzesPassed = (attempts ?? []).filter((a) => {
    if (a.score == null || a.max_score == null || a.max_score <= 0) return false;
    return Number(a.score) / Number(a.max_score) >= 0.6;
  }).length;

  return {
    classesAttended,
    quizzesPassed,
    attendancePercent,
    streakDays,
  };
}

function computeStreak(datesDesc: string[]) {
  if (!datesDesc.length) return 0;
  const unique = [...new Set(datesDesc)];
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const iso of unique) {
    const d = new Date(`${iso}T00:00:00`);
    const diffDays = Math.round(
      (cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0 || diffDays === 1) {
      streak += 1;
      cursor = d;
      continue;
    }
    break;
  }
  return streak;
}

export async function getStudentQuizzes(
  studentId: string
): Promise<StudentQuiz[]> {
  const classes = await getStudentClasses(studentId);
  if (!classes.length) return [];

  const supabase = await getClient();
  if (!supabase) return [];

  const classIds = classes.map((c) => c.id);
  const titleById = Object.fromEntries(classes.map((c) => [c.id, c.title]));

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, class_id, title, description")
    .in("class_id", classIds)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (!quizzes?.length) return [];

  const quizIds = quizzes.map((q) => q.id);
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, score, max_score, submitted_at")
    .eq("student_id", studentId)
    .in("quiz_id", quizIds);

  const attemptByQuiz = Object.fromEntries(
    (attempts ?? []).map((a) => [a.quiz_id, a])
  );

  return quizzes.map((q) => {
    const attempt = attemptByQuiz[q.id];
    return {
      id: q.id,
      class_id: q.class_id,
      class_title: titleById[q.class_id] ?? "Class",
      title: q.title,
      description: q.description,
      attempt: attempt
        ? {
            score: attempt.score != null ? Number(attempt.score) : null,
            max_score:
              attempt.max_score != null ? Number(attempt.max_score) : null,
            submitted_at: attempt.submitted_at,
          }
        : null,
    };
  });
}

export async function getQuizForStudent(
  studentId: string,
  quizId: string
): Promise<{
  quiz: StudentQuiz;
  questions: StudentQuestion[];
} | null> {
  const quizzes = await getStudentQuizzes(studentId);
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return null;

  const supabase = await getClient();
  if (!supabase) return null;

  const { data: fromView } = await supabase
    .from("questions_for_students")
    .select("id, prompt, options, points, sort_order")
    .eq("quiz_id", quizId)
    .order("sort_order", { ascending: true });

  let rows = fromView ?? [];

  if (!rows.length) {
    const { data: full } = await supabase
      .from("questions")
      .select("id, prompt, options, points, sort_order")
      .eq("quiz_id", quizId)
      .order("sort_order", { ascending: true });
    rows = full ?? [];
  }

  const questions: StudentQuestion[] = rows.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: normalizeOptions(q.options),
    points: q.points,
    sort_order: q.sort_order,
  }));

  return { quiz, questions };
}

function normalizeOptions(options: unknown): string[] {
  if (Array.isArray(options)) {
    return options.map(String);
  }
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

export async function getStudentAnnouncements(
  studentId: string
): Promise<StudentAnnouncement[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const classes = await getStudentClasses(studentId);
  const classIds = classes.map((c) => c.id);

  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, created_at, audience, class_id")
    .order("created_at", { ascending: false })
    .limit(40);

  return (data ?? [])
    .filter((a) => {
      if (a.audience === "all" || a.audience === "students") return true;
      if (a.audience === "class" && a.class_id) {
        return classIds.includes(a.class_id);
      }
      return false;
    })
    .map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      created_at: a.created_at,
      audience: a.audience,
    }));
}
