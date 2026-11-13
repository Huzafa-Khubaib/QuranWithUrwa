"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  resetPasswordAction,
  type AuthActionState,
} from "@/lib/auth/actions";

const initial: AuthActionState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initial
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-ink">Choose a new password</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Use at least 8 characters. You’ll be signed into your portal after.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          New password
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Confirm password
        </span>
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}

      <ClayButton
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Update password"
        )}
      </ClayButton>
    </form>
  );
}
