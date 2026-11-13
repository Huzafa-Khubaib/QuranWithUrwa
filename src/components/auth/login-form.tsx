"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { loginAction, type AuthActionState } from "@/lib/auth/actions";
import type { UserRole } from "@/lib/auth/roles";
import { DEMO_PASSWORD, demoAccountByRole } from "@/lib/auth/demo";

const initial: AuthActionState = {};

const copy: Record<
  UserRole,
  { title: string; subtitle: string; color: "mint" | "peach" | "sky" }
> = {
  student: {
    title: "Student login",
    subtitle: "Enter your class portal — links, recordings & progress await.",
    color: "mint",
  },
  teacher: {
    title: "Teacher login",
    subtitle: "Manage your classes, sessions, and students.",
    color: "peach",
  },
  admin: {
    title: "Admin login",
    subtitle: "Academy control — users, requests, and settings.",
    color: "sky",
  },
};

export function LoginForm({ role }: { role: UserRole }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  useActionToast(state);
  const meta = copy[role];
  const demoEnabled =
    process.env.NEXT_PUBLIC_DEMO_AUTH === "true" ||
    process.env.DEMO_AUTH === "true";
  const demo = demoEnabled ? demoAccountByRole(role) : null;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="expectedRole" value={role} />

      <div>
        <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          {meta.title}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{meta.subtitle}</p>
        <p className="font-arabic mt-1 text-lg text-ink/60" dir="rtl">
          بسم الله
        </p>
      </div>

      {demo ? (
        <div className="rounded-2xl bg-soft-yellow/80 px-4 py-3 text-sm">
          <p className="font-extrabold text-ink">Demo login</p>
          <p className="mt-1 font-semibold break-all text-ink-muted">
            {demo.email}
          </p>
          <p className="font-semibold text-ink-muted">Password: {DEMO_PASSWORD}</p>
        </div>
      ) : null}

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={demo?.email ?? ""}
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="you@email.com"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={6}
          defaultValue={demo ? DEMO_PASSWORD : ""}
          className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="••••••••"
        />
      </label>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-ink-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Forgot password?
        </Link>
      </div>

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
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </ClayButton>

      <p className="text-center text-xs font-semibold text-ink-muted">
        No public signup — accounts are created by the academy admin.
      </p>
    </form>
  );
}
