import type { AcademyRequestPayload } from "@/lib/validators/academy-request";
import { siteConfig } from "@/lib/site";
import { sendAdminEmail } from "@/lib/email/send-admin-email";

type NotifyKind = "demo" | "enrollment";

export async function notifyAdminOfRequest(
  kind: NotifyKind,
  data: AcademyRequestPayload,
  recordId: string
) {
  const label = kind === "demo" ? "Demo request" : "Enrollment request";

  const result = await sendAdminEmail({
    subject: `[Quran With Urwa] New ${label.toLowerCase()} — ${data.childName}`,
    title: label,
    intro: `A new request was submitted on ${siteConfig.name}.`,
    replyTo: data.email,
    rows: [
      ["Parent", data.parentName],
      ["Child", data.childName],
      ["Age", String(data.childAge)],
      ["WhatsApp", data.whatsappNumber],
      ["Email", data.email],
      ["Country", data.country],
      ["Course", data.courseInterest],
      ["Preferred time", data.preferredTime],
      ["Message", data.message?.trim() || "—"],
      ["Status", "pending"],
      ["Record ID", recordId],
    ],
  });

  if (!result.ok) {
    if (result.missingConfig) {
      console.warn("[notify-admin]", result.error);
      return { skipped: true as const };
    }
    return { skipped: false as const, sent: false as const, error: result.error };
  }

  return { skipped: false as const, sent: true as const };
}
