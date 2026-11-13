"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  forgotPasswordAction,
  type AuthActionState,
} from "@/lib/auth/actions";

const initial: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initial
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-ink">Forgot password</h1>
        <p className="mt-1 text-sm text-ink-muted">
          We’ll email you a secure link to choose a new password.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="you@email.com"
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
        variant="primary"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </ClayButton>

      <p className="text-center text-xs font-semibold text-ink-muted">
        <Link href="/login/student" className="underline underline-offset-2">
          Back to student login
        </Link>
        {" · "}
        <Link href="/login/teacher" className="underline underline-offset-2">
          Teacher
        </Link>
      </p>
    </form>
  );
}
