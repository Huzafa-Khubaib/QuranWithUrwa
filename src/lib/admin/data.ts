import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminClass,
  AdminCourse,
  AdminProfile,
  AdminStats,
  FeeRecord,
  IntakeRequest,
} from "@/lib/admin/types";

async function getClient() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

function mapRequest(
  kind: "demo" | "enrollment",
  row: Record<string, unknown>
): IntakeRequest {
  return {
    id: String(row.id),
    kind,
    parent_name: String(row.parent_name),
    child_name: String(row.child_name),
    child_age: Number(row.child_age),
    whatsapp_number: String(row.whatsapp_number),
    email: String(row.email),
    country: String(row.country),
    course_interest: String(row.course_interest),
    preferred_time: String(row.preferred_time),
    message: (row.message as string | null) ?? null,
    status: row.status as IntakeRequest["status"],
    processed_user_id: (row.processed_user_id as string | null) ?? null,
    created_at: String(row.created_at),
  };
}

export async function getIntakeRequests(): Promise<IntakeRequest[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const [demos, enrollments] = await Promise.all([
    supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("enrollment_requests")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return [
    ...(demos.data ?? []).map((r) => mapRequest("demo", r)),
    ...(enrollments.data ?? []).map((r) => mapRequest("enrollment", r)),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getProfilesByRole(
  role: "teacher" | "student" | "admin"
): Promise<AdminProfile[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, avatar_url")
    .eq("role", role)
    .order("full_name");

  // Best-effort emails via service role
  let emailById: Record<string, string> = {};
  try {
    const admin = createAdminClient();
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    emailById = Object.fromEntries(
      (list?.users ?? []).map((u) => [u.id, u.email ?? ""])
    );
  } catch {
    emailById = {};
  }

  return (data ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    role: p.role,
    phone: p.phone,
    avatar_url: p.avatar_url,
    email: emailById[p.id] || null,
  }));
}

export async function getAdminCourses(): Promise<AdminCourse[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");

  return (data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    arabic_title: c.arabic_title,
    description: c.description,
    level: c.level,
    is_active: c.is_active,
    sort_order: c.sort_order,
  }));
}

export async function getAdminClasses(): Promise<AdminClass[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data: classes } = await supabase
    .from("classes")
    .select(
      `
      id, title, course_id, teacher_id, platform, meeting_link,
      schedule_days, start_time, duration_minutes, is_active,
      courses ( title ),
      profiles:teacher_id ( full_name )
    `
    )
    .order("title");

  if (!classes?.length) return [];

  const ids = classes.map((c) => c.id);
  const { data: links } = await supabase
    .from("class_students")
    .select("class_id")
    .in("class_id", ids);

  const counts: Record<string, number> = {};
  for (const l of links ?? []) {
    counts[l.class_id] = (counts[l.class_id] ?? 0) + 1;
  }

  return classes.map((c) => {
    const course = Array.isArray(c.courses) ? c.courses[0] : c.courses;
    const teacher = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
    return {
      id: c.id,
      title: c.title,
      course_id: c.course_id,
      course_title: course?.title ?? null,
      teacher_id: c.teacher_id,
      teacher_name: teacher?.full_name ?? null,
      platform: c.platform === "zoom" ? "zoom" : "meet",
      meeting_link: c.meeting_link,
      schedule_days: c.schedule_days ?? [],
      start_time: c.start_time,
      duration_minutes: c.duration_minutes ?? 45,
      is_active: c.is_active,
      student_count: counts[c.id] ?? 0,
    };
  });
}

export async function getAdminClassDetail(classId: string) {
  const classes = await getAdminClasses();
  const classItem = classes.find((c) => c.id === classId);
  if (!classItem) return null;

  const supabase = await getClient();
  if (!supabase) return { classItem, studentIds: [] as string[] };

  const { data: links } = await supabase
    .from("class_students")
    .select("student_id")
    .eq("class_id", classId);

  return {
    classItem,
    studentIds: (links ?? []).map((l) => l.student_id),
  };
}

export async function getFeeRecords(yearMonth: string): Promise<FeeRecord[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const students = await getProfilesByRole("student");
  const { data, error } = await supabase
    .from("fee_records")
    .select("*")
    .eq("year_month", yearMonth);

  if (error) {
    // Table may not exist until migration 004 is applied
    console.warn("[fee_records]", error.message);
  }

  const byStudent = Object.fromEntries(
    (data ?? []).map((r) => [r.student_id, r])
  );

  return students.map((s) => {
    const row = byStudent[s.id];
    return {
      id: row?.id ?? `virtual-${s.id}`,
      student_id: s.id,
      student_name: s.full_name,
      year_month: yearMonth,
      status: (row?.status as "paid" | "unpaid") ?? "unpaid",
      amount: row?.amount != null ? Number(row.amount) : null,
      notes: row?.notes ?? null,
    };
  });
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await getClient();
  if (!supabase) {
    return {
      pendingRequests: 0,
      students: 0,
      teachers: 0,
      classes: 0,
      unpaidFees: 0,
      paidFeesThisMonth: 0,
    };
  }

  const month = new Date().toISOString().slice(0, 7);

  const [
    demos,
    enrollments,
    students,
    teachers,
    classes,
    unpaid,
    paidMonth,
  ] = await Promise.all([
    supabase
      .from("demo_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("enrollment_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "teacher"),
    supabase
      .from("classes")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("fee_records")
      .select("id", { count: "exact", head: true })
      .eq("status", "unpaid"),
    supabase
      .from("fee_records")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .eq("year_month", month),
  ]);

  return {
    pendingRequests: (demos.count ?? 0) + (enrollments.count ?? 0),
    students: students.count ?? 0,
    teachers: teachers.count ?? 0,
    classes: classes.count ?? 0,
    unpaidFees: unpaid.count ?? 0,
    paidFeesThisMonth: paidMonth.count ?? 0,
  };
}
