"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  setClassStudentsAction,
  type AdminActionState,
} from "@/lib/admin/actions";
import type { AdminProfile } from "@/lib/admin/types";

const initial: AdminActionState = {};

export function ClassRosterForm({
  classId,
  students,
  selectedIds,
}: {
  classId: string;
  students: AdminProfile[];
  selectedIds: string[];
}) {
  const [state, formAction, pending] = useActionState(
    setClassStudentsAction,
    initial
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="classId" value={classId} />
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {students.map((s) => (
          <label
            key={s.id}
            className="clay-sm flex items-center justify-between rounded-2xl bg-cream px-3 py-2 text-sm font-bold text-ink"
          >
            <span>
              {s.full_name}
              {s.email ? (
                <span className="mt-0.5 block text-[11px] font-semibold text-ink-muted">
                  {s.email}
                </span>
              ) : null}
            </span>
            <input
              type="checkbox"
              name="studentId"
              value={s.id}
              defaultChecked={selectedIds.includes(s.id)}
              className="size-4 accent-primary"
            />
          </label>
        ))}
        {!students.length ? (
          <p className="text-sm font-semibold text-ink-muted">
            No student accounts yet.
          </p>
        ) : null}
      </div>
      {state.error ? (
        <p className="text-sm font-bold text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm font-bold text-primary">{state.success}</p>
      ) : null}
      <ClayButton type="submit" variant="mint" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Save roster"}
      </ClayButton>
    </form>
  );
}
