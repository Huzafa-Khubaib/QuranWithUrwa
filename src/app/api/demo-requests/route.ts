import { NextResponse } from "next/server";
import { submitAcademyRequest } from "@/lib/requests/submit-request";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = await submitAcademyRequest("demo", body);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        fieldErrors: "fieldErrors" in result ? result.fieldErrors : undefined,
      },
      { status: result.status }
    );
  }

  return NextResponse.json({ success: true, id: "id" in result ? result.id : undefined });
}
