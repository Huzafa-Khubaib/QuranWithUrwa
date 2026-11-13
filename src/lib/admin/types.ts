export type IntakeRequest = {
  id: string;
  kind: "demo" | "enrollment";
  parent_name: string;
  child_name: string;
  child_age: number;
  whatsapp_number: string;
  email: string;
  country: string;
  course_interest: string;
  preferred_time: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  processed_user_id: string | null;
  created_at: string;
};

export type AdminProfile = {
  id: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  phone: string | null;
  avatar_url: string | null;
  email?: string | null;
};

export type AdminCourse = {
  id: string;
  slug: string;
  title: string;
  arabic_title: string | null;
  description: string | null;
  level: string | null;
  is_active: boolean;
  sort_order: number;
};

export type AdminClass = {
  id: string;
  title: string;
  course_id: string;
  course_title: string | null;
  teacher_id: string;
  teacher_name: string | null;
  platform: "meet" | "zoom";
  meeting_link: string | null;
  schedule_days: string[];
  start_time: string | null;
  duration_minutes: number;
  is_active: boolean;
  student_count: number;
};

export type FeeRecord = {
  id: string;
  student_id: string;
  student_name: string;
  year_month: string;
  status: "paid" | "unpaid";
  amount: number | null;
  notes: string | null;
};

export type AdminStats = {
  pendingRequests: number;
  students: number;
  teachers: number;
  classes: number;
  unpaidFees: number;
  paidFeesThisMonth: number;
};
