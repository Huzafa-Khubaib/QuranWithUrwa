"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  upsertSessionRecordingAction,
  type ActionState,
} from "@/lib/teacher/actions";

const initial: ActionState = {};

type SessionFormProps = {
  classId: string;
  classTitle: string;
  sessionId?: string;
  defaultDate?: string;
  defaultRecordingUrl?: string;
  defaultNotes?: string;
};

export function SessionForm({
  classId,
  classTitle,
  sessionId,
  defaultDate,
  defaultRecordingUrl = "",
  defaultNotes = "",
}: SessionFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    upsertSessionRecordingAction,
    initial
  );
  useActionToast(state);

  useEffect(() => {
    if (state.id) {
      router.push(`/teacher/sessions/${state.id}`);
    }
  }, [state.id, router]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="classId" value={classId} />
      {sessionId ? <input type="hidden" name="sessionId" value={sessionId} /> : null}

      <p className="text-sm font-bold text-ink-muted">Class: {classTitle}</p>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Session date
        </span>
        <input
          type="date"
          name="sessionDate"
          required
          defaultValue={defaultDate ?? today}
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Recording link (Meet/Zoom/Drive/YouTube)
        </span>
        <input
          type="url"
          name="recordingUrl"
          defaultValue={defaultRecordingUrl}
          placeholder="https://…"
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Notes
        </span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={defaultNotes}
          placeholder="What we covered, homework, tips for parents…"
          className="clay-inset w-full resize-none rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-2xl bg-mint/70 px-4 py-3 text-sm font-bold text-ink">
          {state.success}
        </p>
      ) : null}

      <ClayButton type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Save session"
        )}
      </ClayButton>
    </form>
  );
}
