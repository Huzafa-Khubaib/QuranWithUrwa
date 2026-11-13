import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ExternalLink, Video } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { getSessionProfile } from "@/lib/auth/get-profile";
import { getStudentClasses } from "@/lib/student/data";
import { formatTimeLabel } from "@/lib/student/schedule";

export const metadata: Metadata = {
  title: "My Classes",
  robots: { index: false, follow: false },
};

export default function StudentClassesPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <ClassesContent />
    </Suspense>
  );
}

async function ClassesContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  const classes = await getStudentClasses(profile.id);
  const colors = ["peach", "mint", "yellow", "sky"] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">My Classes</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Only classes you’re enrolled in appear here.
        </p>
      </div>

      {!classes.length ? (
        <ClayCard color="white" className="p-8 text-center">
          <p className="font-extrabold text-ink">No classes yet</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Your admin will enroll you — then Meet/Zoom links will show up.
          </p>
        </ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((c, i) => (
            <ClayCard key={c.id} color={colors[i % colors.length]} className="p-5 sm:p-6">
              <p className="text-xs font-extrabold tracking-wide text-ink/60 uppercase">
                {c.course_title ?? "Course"}
              </p>
              <h2 className="mt-1 text-xl font-black text-ink">{c.title}</h2>
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                {c.teacher_name ? `Teacher: ${c.teacher_name}` : "Teacher assigned"}
              </p>
              <p className="mt-1 text-sm font-bold text-ink">
                {c.schedule_days.join(", ") || "Days TBD"} ·{" "}
                {formatTimeLabel(c.start_time)} · {c.duration_minutes} min
              </p>
              <p className="mt-1 text-xs font-bold text-ink/55">
                Platform: {c.platform === "zoom" ? "Zoom" : "Google Meet"}
              </p>
              <div className="mt-4">
                {c.meeting_link ? (
                  <ClayButton href={c.meeting_link} external variant="primary">
                    <Video className="size-4" aria-hidden />
                    Join Class
                    <ExternalLink className="size-3.5 opacity-70" aria-hidden />
                  </ClayButton>
                ) : (
                  <p className="text-xs font-bold text-ink-muted">
                    Link not shared yet
                  </p>
                )}
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
