import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminOfRequest } from "@/lib/email/notify-admin";
import {
  academyRequestSchema,
  type AcademyRequestPayload,
} from "@/lib/validators/academy-request";

export type RequestKind = "demo" | "enrollment";

const tableByKind = {
  demo: "demo_requests",
  enrollment: "enrollment_requests",
} as const;

function toRow(data: AcademyRequestPayload) {
  return {
    parent_name: data.parentName,
    child_name: data.childName,
    child_age: data.childAge,
    whatsapp_number: data.whatsappNumber,
    email: data.email,
    country: data.country,
    course_interest: data.courseInterest,
    preferred_time: data.preferredTime,
    message: data.message?.trim() ? data.message.trim() : null,
    status: "pending" as const,
  };
}

export async function submitAcademyRequest(kind: RequestKind, raw: unknown) {
  const parsed = academyRequestSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false as const,
      status: 400,
      error: "Please check the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { website, ...payload } = parsed.data;

  // Honeypot tripped — pretend success so bots learn nothing.
  if (website && website.length > 0) {
    return { ok: true as const, status: 200, honeypot: true as const };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return {
      ok: false as const,
      status: 503,
      error:
        "Server is missing Supabase configuration. Add URL and service role key to .env.local.",
    };
  }

  const { data, error } = await supabase
    .from(tableByKind[kind])
    .insert(toRow(payload))
    .select("id")
    .single();

  if (error || !data) {
    console.error(`[submit-${kind}]`, error?.message);
    return {
      ok: false as const,
      status: 500,
      error: "We couldn’t save your request. Please try again shortly.",
    };
  }

  await notifyAdminOfRequest(kind, payload, data.id);

  return { ok: true as const, status: 200, id: data.id as string };
}
