"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { postAnnouncementAction, type ActionState } from "@/lib/teacher/actions";
import type { TeacherClass } from "@/lib/teacher/types";

const initial: ActionState = {};

export function AnnouncementForm({ classes }: { classes: TeacherClass[] }) {
  const [state, formAction, pending] = useActionState(
    postAnnouncementAction,
    initial
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Class
        </span>
        <select
          name="classId"
          required
          defaultValue=""
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="" disabled>
            Select class
          </option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Title
        </span>
        <input
          name="title"
          required
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Message
        </span>
        <textarea
          name="body"
          required
          rows={4}
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

      <ClayButton
        type="submit"
        variant="peach"
        size="lg"
        disabled={pending || !classes.length}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Posting…
          </>
        ) : (
          "Post to class"
        )}
      </ClayButton>
    </form>
  );
}
