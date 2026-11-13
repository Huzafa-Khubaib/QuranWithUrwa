"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { sendUserEmail } from "@/lib/email/send-user-email";
import { siteConfig } from "@/lib/site";
import { getTeacherClass, getTeacherSession } from "@/lib/teacher/data";

async function requireTeacher() {
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "teacher") {
    return { error: "Not authorized." as const, profile: null };
  }
  return { error: null, profile };
}

async function client() {
  return createClient();
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export type ActionState = { error?: string; success?: string; id?: string };

const createStudentSchema = z.object({
  classId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72).optional(),
  phone: z.string().trim().max(20).optional(),
  sendEmail: z.boolean().optional(),
});

export async function createStudentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const passwordRaw = String(formData.get("password") ?? "").trim();
  const parsed = createStudentSchema.safeParse({
    classId: formData.get("classId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: passwordRaw || undefined,
    phone: String(formData.get("phone") || "").trim() || undefined,
    sendEmail: formData.get("sendEmail") === "on",
  });

  if (!parsed.success) {
    return { error: "Please fill name, email, and select a class." };
  }

  const owned = await getTeacherClass(auth.profile.id, parsed.data.classId);
  if (!owned) return { error: "Class not found." };

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Missing SUPABASE_SERVICE_ROLE_KEY." };
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password || generatePassword();
  let createdNew = true;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      role: "student",
      phone: parsed.data.phone,
    },
  });

  let userId = created?.user?.id;
  if (createError || !userId) {
    const { data: listed } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = listed?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );
    if (!existing) {
      return { error: createError?.message ?? "Could not create student account." };
    }
    userId = existing.id;
    createdNew = false;
  }

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (existingProfile && existingProfile.role !== "student") {
    return {
      error: `That email belongs to a ${existingProfile.role} account — use a different email.`,
    };
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    full_name: parsed.data.fullName,
    role: "student",
    phone: parsed.data.phone || null,
  });

  if (profileError) {
    return { error: `Account created but profile failed: ${profileError.message}` };
  }

  const { error: enrollError } = await admin.from("class_students").upsert(
    { class_id: parsed.data.classId, student_id: userId },
    { onConflict: "class_id,student_id", ignoreDuplicates: true }
  );

  if (enrollError) {
    return { error: `Student saved but enroll failed: ${enrollError.message}` };
  }

  revalidatePath("/teacher/students");
  revalidatePath("/teacher/classes");
  revalidatePath(`/teacher/classes/${parsed.data.classId}`);
  revalidatePath("/teacher");

  const loginUrl = `${siteConfig.url}/login/student`;
  let emailNote = "";

  if (parsed.data.sendEmail && createdNew) {
    const emailResult = await sendUserEmail({
      to: email,
      subject: `Welcome to ${siteConfig.name} — your login details`,
      title: "Your student account is ready",
      intro: `Assalamu Alaikum! ${auth.profile.full_name} enrolled you in ${owned.title}.`,
      rows: [
        ["Portal", loginUrl],
        ["Email", email],
        ["Temporary password", password],
        ["Class", owned.title],
      ],
      htmlExtra: `<p style="margin-top:16px;color:#6b534e;font-size:14px">Sign in at the student portal. You can reset the password anytime via Forgot password.</p>`,
    });
    emailNote = emailResult.ok
      ? " Credentials emailed."
      : ` Email failed (${emailResult.error}).`;
  }

  if (!createdNew) {
    return {
      success: `${parsed.data.fullName} already had an account — added to ${owned.title}.${emailNote}`,
      id: userId,
    };
  }

  return {
    success: `Student created and added to ${owned.title}. Login: ${email} · Password: ${password}.${emailNote}`,
    id: userId,
  };
}

export async function upsertSessionRecordingAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const schema = z.object({
    classId: z.string().uuid(),
    sessionDate: z.string().min(8),
    recordingUrl: z.union([z.literal(""), z.string().url()]).optional(),
    notes: z.string().max(2000).optional(),
    sessionId: z.union([z.literal(""), z.string().uuid()]).optional(),
  });

  const parsed = schema.safeParse({
    classId: formData.get("classId"),
    sessionDate: formData.get("sessionDate"),
    recordingUrl: formData.get("recordingUrl") || "",
    notes: formData.get("notes") || "",
    sessionId: formData.get("sessionId") || "",
  });

  if (!parsed.success) {
    return { error: "Please check the session fields." };
  }

  const owned = await getTeacherClass(auth.profile.id, parsed.data.classId);
  if (!owned) return { error: "Class not found." };

  const supabase = await client();
  const payload = {
    class_id: parsed.data.classId,
    session_date: parsed.data.sessionDate,
    recording_url: parsed.data.recordingUrl || null,
    notes: parsed.data.notes?.trim() || null,
  };

  if (parsed.data.sessionId) {
    const existing = await getTeacherSession(
      auth.profile.id,
      parsed.data.sessionId
    );
    if (!existing) return { error: "Session not found." };

    const { error } = await supabase
      .from("sessions")
      .update(payload)
      .eq("id", parsed.data.sessionId);

    if (error) return { error: error.message };
    revalidatePath("/teacher");
    revalidatePath(`/teacher/sessions/${parsed.data.sessionId}`);
    revalidatePath(`/teacher/classes/${parsed.data.classId}`);
    return { success: "Session updated." };
  }

  const { data, error } = await supabase
    .from("sessions")
    .upsert(payload, { onConflict: "class_id,session_date" })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/teacher");
  revalidatePath(`/teacher/classes/${parsed.data.classId}`);
  return { success: "Session saved.", id: data.id };
}

export async function saveAttendanceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const sessionId = String(formData.get("sessionId") ?? "");
  if (!z.string().uuid().safeParse(sessionId).success) {
    return { error: "Invalid session." };
  }

  const session = await getTeacherSession(auth.profile.id, sessionId);
  if (!session) return { error: "Session not found." };

  const presentIds = formData.getAll("present").map(String);
  const allIds = formData.getAll("studentId").map(String);

  const supabase = await client();
  const rows = allIds.map((student_id) => ({
    session_id: sessionId,
    student_id,
    present: presentIds.includes(student_id),
    marked_at: new Date().toISOString(),
  }));

  if (!rows.length) return { error: "No students to mark." };

  const { error } = await supabase.from("attendance").upsert(rows, {
    onConflict: "session_id,student_id",
  });

  if (error) return { error: error.message };

  revalidatePath(`/teacher/sessions/${sessionId}`);
  return { success: "Attendance saved." };
}

export async function createQuizAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const classId = String(formData.get("classId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const publish = formData.get("publish") === "on";

  if (!z.string().uuid().safeParse(classId).success || title.length < 2) {
    return { error: "Class and title are required." };
  }

  const owned = await getTeacherClass(auth.profile.id, classId);
  if (!owned) return { error: "Class not found." };

  let questions: Array<{
    prompt: string;
    options: string[];
    correct: string;
    explanation: string;
  }> = [];

  try {
    const raw = String(formData.get("questionsJson") ?? "[]");
    questions = JSON.parse(raw);
  } catch {
    return { error: "Invalid questions payload." };
  }

  if (!questions.length) {
    return { error: "Add at least one question." };
  }

  for (const q of questions) {
    if (!q.prompt?.trim() || q.options?.length !== 4 || !q.correct) {
      return { error: "Each question needs a prompt, 4 options, and a correct answer." };
    }
    if (!q.options.includes(q.correct)) {
      return { error: "Correct answer must match one of the 4 options." };
    }
  }

  const supabase = await client();
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .insert({
      class_id: classId,
      title,
      description: description || null,
      is_published: publish,
      created_by: auth.profile.id,
    })
    .select("id")
    .single();

  if (error || !quiz) return { error: error?.message ?? "Could not create quiz." };

  const rows = questions.map((q, i) => ({
    quiz_id: quiz.id,
    prompt: q.prompt.trim(),
    options: q.options.map((o) => o.trim()),
    correct_answer: q.correct.trim(),
    explanation: q.explanation?.trim() || null,
    points: 1,
    sort_order: i,
  }));

  const { error: qError } = await supabase.from("questions").insert(rows);
  if (qError) return { error: qError.message };

  revalidatePath("/teacher/quizzes");
  return { success: "Quiz created.", id: quiz.id };
}

export async function toggleQuizPublishAction(
  quizId: string,
  isPublished: boolean
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const supabase = await client();
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, class_id")
    .eq("id", quizId)
    .maybeSingle();

  if (!quiz) return { error: "Quiz not found." };

  const owned = await getTeacherClass(auth.profile.id, quiz.class_id);
  if (!owned) return { error: "Quiz not found." };

  const { error } = await supabase
    .from("quizzes")
    .update({ is_published: isPublished })
    .eq("id", quizId);

  if (error) return { error: error.message };
  revalidatePath("/teacher/quizzes");
  revalidatePath(`/teacher/quizzes/${quizId}`);
  return { success: isPublished ? "Quiz published." : "Quiz unpublished." };
}

export async function postAnnouncementAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const classId = String(formData.get("classId") ?? "");

  if (title.length < 2 || body.length < 2) {
    return { error: "Title and message are required." };
  }
  if (!z.string().uuid().safeParse(classId).success) {
    return { error: "Select a class." };
  }

  const owned = await getTeacherClass(auth.profile.id, classId);
  if (!owned) return { error: "Class not found." };

  const supabase = await client();
  const { error } = await supabase.from("announcements").insert({
    title,
    body,
    audience: "class",
    class_id: classId,
    created_by: auth.profile.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/teacher/announcements");
  return { success: "Announcement posted to the class." };
}

export async function updateMeetingLinkAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireTeacher();
  if (auth.error || !auth.profile) return { error: auth.error ?? "Unauthorized" };

  const classId = String(formData.get("classId") ?? "");
  const meetingLink = String(formData.get("meetingLink") ?? "").trim();

  if (!z.string().uuid().safeParse(classId).success) {
    return { error: "Invalid class." };
  }

  const owned = await getTeacherClass(auth.profile.id, classId);
  if (!owned) return { error: "Class not found." };

  const supabase = await client();
  const { error } = await supabase
    .from("classes")
    .update({ meeting_link: meetingLink || null })
    .eq("id", classId)
    .eq("teacher_id", auth.profile.id);

  if (error) return { error: error.message };
  revalidatePath("/teacher/classes");
  revalidatePath(`/teacher/classes/${classId}`);
  revalidatePath("/teacher");
  return { success: "Meeting link updated." };
}
