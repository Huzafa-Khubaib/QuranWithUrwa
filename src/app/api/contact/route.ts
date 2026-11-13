import { NextResponse } from "next/server";
import { z } from "zod";
import { sendAdminEmail } from "@/lib/email/send-admin-email";
import { siteConfig } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  interest: z.string().trim().min(2).max(80),
  message: z.string().trim().max(1000).optional().default(""),
  website: z.string().max(200).optional().default(""),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const { website, ...data } = parsed.data;

  // Honeypot — fake success
  if (website.length > 0) {
    return NextResponse.json({ success: true });
  }

  const result = await sendAdminEmail({
    subject: `[Quran With Urwa] Contact — ${data.name} (${data.interest})`,
    title: "New contact message",
    intro: `Someone messaged ${siteConfig.name} from the contact form.`,
    replyTo: data.email,
    rows: [
      ["Name", data.name],
      ["Email", data.email],
      ["Interest", data.interest],
      ["Message", data.message.trim() || "—"],
    ],
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.missingConfig ? 503 : 502 }
    );
  }

  return NextResponse.json({ success: true });
}
