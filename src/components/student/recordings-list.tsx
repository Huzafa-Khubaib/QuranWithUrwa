import { ExternalLink, PlayCircle } from "lucide-react";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import type { StudentSession } from "@/lib/student/types";

function isEmbeddable(url: string) {
  try {
    const u = new URL(url);
    return (
      u.hostname.includes("youtube.com") ||
      u.hostname.includes("youtu.be") ||
      u.hostname.includes("drive.google.com") ||
      u.hostname.includes("vimeo.com")
    );
  } catch {
    return false;
  }
}

function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("drive.google.com")) {
      // /file/d/FILE_ID/view → preview
      const match = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function RecordingsList({ sessions }: { sessions: StudentSession[] }) {
  const withRecording = sessions.filter((s) => s.recording_url);

  if (!withRecording.length) {
    return (
      <ClayCard color="white" className="p-8 text-center">
        <PlayCircle className="mx-auto size-10 text-ink/25" aria-hidden />
        <p className="mt-3 font-extrabold text-ink">No recordings yet</p>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          When your teacher shares a session recording or Drive link, it will
          show up here.
        </p>
      </ClayCard>
    );
  }

  return (
    <div className="space-y-4">
      {withRecording.map((session, i) => {
        const embed = session.recording_url
          ? toEmbedUrl(session.recording_url)
          : null;
        const colors = ["peach", "mint", "yellow", "sky"] as const;

        return (
          <ClayCard
            key={session.id}
            color={colors[i % colors.length]}
            className="overflow-hidden p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold tracking-wide text-ink/60 uppercase">
                  {new Date(`${session.session_date}T00:00:00`).toLocaleDateString(
                    undefined,
                    { weekday: "short", month: "short", day: "numeric" }
                  )}
                </p>
                <h3 className="mt-1 text-lg font-black text-ink">
                  {session.class_title}
                </h3>
                {session.notes ? (
                  <p className="mt-2 text-sm font-semibold text-ink-muted">
                    {session.notes}
                  </p>
                ) : null}
                <div className="mt-4">
                  <ClayButton
                    href={session.recording_url!}
                    external
                    variant="outline"
                    className="bg-[#FFFAF3]/80"
                  >
                    Open link
                    <ExternalLink className="size-4" aria-hidden />
                  </ClayButton>
                </div>
              </div>

              {embed && isEmbeddable(session.recording_url!) ? (
                <div className="clay-sm w-full overflow-hidden rounded-2xl bg-ink/5 lg:max-w-md">
                  <iframe
                    src={embed}
                    title={`Recording ${session.class_title}`}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </div>
          </ClayCard>
        );
      })}
    </div>
  );
}
