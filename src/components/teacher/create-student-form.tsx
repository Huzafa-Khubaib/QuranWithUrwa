"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  createStudentAction,
  type ActionState,
} from "@/lib/teacher/actions";

const initial: ActionState = {};

type ClassOption = { id: string; title: string };

export function CreateStudentForm({
  classes,
  defaultClassId,
}: {
  classes: ClassOption[];
  defaultClassId?: string;
}) {
  const [state, formAction, pending] = useActionState(
    createStudentAction,
    initial
  );
  useActionToast(state);

  if (!classes.length) {
    return (
      <ClayCard color="yellow" className="p-5 text-sm font-semibold text-ink-muted">
        You need at least one class assigned by admin before you can add
        students.
      </ClayCard>
    );
  }

  return (
    <ClayCard color="white" className="p-6 sm:p-7">
      <h2 className="text-lg font-black text-ink">Add student</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Creates a student login and enrolls them in your class. Share the
        password if email is skipped.
      </p>

      <form action={formAction} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Class
          </span>
          <select
            name="classId"
            required
            defaultValue={defaultClassId ?? classes[0]?.id}
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Student full name
          </span>
          <input
            name="fullName"
            required
            minLength={2}
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Email (login)
          </span>
          <input
            name="email"
            type="email"
            required
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Password (optional)
          </span>
          <input
            name="password"
            type="text"
            minLength={8}
            placeholder="Auto-generate if empty"
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Phone / WhatsApp (optional)
          </span>
          <input
            name="phone"
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            name="sendEmail"
            defaultChecked
            className="size-4 accent-primary"
          />
          <span className="text-sm font-bold text-ink">
            Email login details to the student
          </span>
        </label>

        {state.error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 sm:col-span-2">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="rounded-2xl bg-mint/70 px-4 py-3 text-sm font-bold text-ink sm:col-span-2">
            {state.success}
          </p>
        ) : null}

        <div className="sm:col-span-2">
          <ClayButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Creating…
              </>
            ) : (
              "Create & enroll student"
            )}
          </ClayButton>
        </div>
      </form>
    </ClayCard>
  );
}
