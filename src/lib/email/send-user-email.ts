import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendUserEmail(options: {
  to: string;
  subject: string;
  title: string;
  intro?: string;
  rows?: Array<[string, string]>;
  htmlExtra?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Quran With Urwa <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      ok: false as const,
      missingConfig: true as const,
      error: "RESEND_API_KEY is not set.",
    };
  }

  const resend = new Resend(apiKey);
  const rowsHtml = (options.rows ?? [])
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e4d6;font-weight:700;width:140px">${escapeHtml(k)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e4d6">${escapeHtml(v)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Nunito,Arial,sans-serif;color:#3d2c29;line-height:1.5;background:#FFF4E6;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#FFFAF3;border-radius:24px;padding:24px">
        <h2 style="margin:0 0 8px">${escapeHtml(options.title)}</h2>
        ${
          options.intro
            ? `<p style="margin:0 0 16px;color:#6b534e">${escapeHtml(options.intro)}</p>`
            : ""
        }
        ${
          rowsHtml
            ? `<table style="border-collapse:collapse;width:100%">${rowsHtml}</table>`
            : ""
        }
        ${options.htmlExtra ?? ""}
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to: [options.to],
    subject: options.subject,
    html,
  });

  if (error) {
    console.error("[send-user-email]", error.message);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, id: data?.id };
}
