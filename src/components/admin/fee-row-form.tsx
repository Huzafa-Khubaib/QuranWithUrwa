"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  updateFeeStatusAction,
  type AdminActionState,
} from "@/lib/admin/actions";
import type { FeeRecord } from "@/lib/admin/types";

const initial: AdminActionState = {};

export function FeeRowForm({
  record,
  yearMonth,
}: {
  record: FeeRecord;
  yearMonth: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateFeeStatusAction,
    initial
  );
  useActionToast(state);

  return (
    <form
      action={formAction}
      className="clay-sm grid gap-2 rounded-2xl bg-cream p-3 sm:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr_auto] sm:items-end"
    >
      <input type="hidden" name="studentId" value={record.student_id} />
      <input type="hidden" name="yearMonth" value={yearMonth} />

      <div>
        <p className="text-sm font-extrabold text-ink">{record.student_name}</p>
        <p className="text-[11px] font-semibold text-ink-muted">{yearMonth}</p>
      </div>

      <label className="block">
        <span className="mb-1 block text-[10px] font-extrabold tracking-wide text-ink-muted uppercase">
          Status
        </span>
        <select
          name="status"
          defaultValue={record.status}
          className="clay-inset w-full rounded-xl border border-ink/5 bg-[#FFFAF3] px-2 py-2 text-sm font-semibold"
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-extrabold tracking-wide text-ink-muted uppercase">
          Amount
        </span>
        <input
          name="amount"
          type="number"
          step="0.01"
          defaultValue={record.amount ?? ""}
          placeholder="0"
          className="clay-inset w-full rounded-xl border border-ink/5 bg-[#FFFAF3] px-2 py-2 text-sm font-semibold"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-extrabold tracking-wide text-ink-muted uppercase">
          Notes
        </span>
        <input
          name="notes"
          defaultValue={record.notes ?? ""}
          className="clay-inset w-full rounded-xl border border-ink/5 bg-[#FFFAF3] px-2 py-2 text-sm font-semibold"
        />
      </label>

      <div>
        <ClayButton type="submit" variant="primary" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
        </ClayButton>
        {state.error ? (
          <p className="mt-1 text-[10px] font-bold text-red-700">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="mt-1 text-[10px] font-bold text-primary">{state.success}</p>
        ) : null}
      </div>
    </form>
  );
}
