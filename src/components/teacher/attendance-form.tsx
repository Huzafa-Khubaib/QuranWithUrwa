"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { saveAttendanceAction, type ActionState } from "@/lib/teacher/actions";

const initial: ActionState = {};

type AttendanceFormProps = {
  sessionId: string;
  rows: Array<{ student_id: string; full_name: string; present: boolean }>;
};

export function AttendanceForm({ sessionId, rows }: AttendanceFormProps) {
  const [state, formAction, pending] = useActionState(
    saveAttendanceAction,
    initial
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="sessionId" value={sessionId} />

      <div className="space-y-2">
        {rows.map((row) => (
          <label
            key={row.student_id}
            className="clay-sm flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3"
          >
            <span className="text-sm font-bold text-ink">{row.full_name}</span>
            <input type="hidden" name="studentId" value={row.student_id} />
            <span className="inline-flex items-center gap-2 text-xs font-extrabold text-ink-muted">
              Present
              <input
                type="checkbox"
                name="present"
                value={row.student_id}
                defaultChecked={row.present}
                className="size-4 rounded accent-primary"
              />
            </span>
          </label>
        ))}
      </div>

      {!rows.length ? (
        <p className="text-sm font-semibold text-ink-muted">
          No students enrolled in this class yet.
        </p>
      ) : null}

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
        variant="primary"
        size="lg"
        disabled={pending || !rows.length}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Save attendance"
        )}
      </ClayButton>
    </form>
  );
}
