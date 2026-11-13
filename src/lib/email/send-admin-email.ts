import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export type AdminEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; missingConfig?: boolean };

export async function sendAdminEmail(options: {
  subject: string;
  title: string;
  intro?: string;
  rows: Array<[string, string]>;
  replyTo?: string;
}): Promise<AdminEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Quran With Urwa <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return {
      ok: false,
      missingConfig: true,
      error:
        "Email is not configured. Set RESEND_API_KEY and ADMIN_NOTIFICATION_EMAIL in .env.local.",
    };
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:Nunito,Arial,sans-serif;color:#3d2c29;line-height:1.5;background:#FFF4E6;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#FFFAF3;border-radius:24px;padding:24px;box-shadow:8px 8px 20px rgba(61,44,41,0.08)">
        <h2 style="margin:0 0 8px">${escapeHtml(options.title)}</h2>
        ${
          options.intro
            ? `<p style="margin:0 0 16px;color:#6b534e">${escapeHtml(options.intro)}</p>`
            : ""
        }
        <table style="border-collapse:collapse;width:100%">
          ${options.rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #f0e4d6;font-weight:700;width:140px">${escapeHtml(k)}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #f0e4d6">${escapeHtml(v)}</td>
            </tr>`
            )
            .join("")}
        </table>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: options.replyTo,
    subject: options.subject,
    html,
  });

  if (error) {
    console.error("[send-admin-email]", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data?.id };
}
