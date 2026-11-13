"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  createUserAccountAction,
  type AuthActionState,
} from "@/lib/auth/actions";

const initial: AuthActionState = {};

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(
    createUserAccountAction,
    initial
  );
  useActionToast(state);

  return (
    <ClayCard color="white" className="p-6 sm:p-7">
      <h2 className="text-lg font-black text-ink">Create account</h2>
      <p className="mt-1 text-sm text-ink-muted">
        No public signup — invite teachers and students here. They’ll use their
        role login page.
      </p>

      <form action={formAction} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Full name
          </span>
          <input
            name="fullName"
            required
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Email
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
            Temporary password
          </span>
          <input
            name="password"
            type="text"
            required
            minLength={8}
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Role
          </span>
          <select
            name="role"
            required
            defaultValue="student"
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
            Phone (optional)
          </span>
          <input
            name="phone"
            className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
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
              "Create user"
            )}
          </ClayButton>
        </div>
      </form>
    </ClayCard>
  );
}
