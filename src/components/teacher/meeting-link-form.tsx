"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { updateMeetingLinkAction, type ActionState } from "@/lib/teacher/actions";

const initial: ActionState = {};

export function MeetingLinkForm({
  classId,
  defaultLink,
}: {
  classId: string;
  defaultLink: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateMeetingLinkAction,
    initial
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="classId" value={classId} />
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Meet / Zoom link
        </span>
        <input
          name="meetingLink"
          type="url"
          defaultValue={defaultLink}
          placeholder="https://meet.google.com/…"
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>
      {state.error ? (
        <p className="text-sm font-bold text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm font-bold text-primary">{state.success}</p>
      ) : null}
      <ClayButton type="submit" variant="primary" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Save link"
        )}
      </ClayButton>
    </form>
  );
}
