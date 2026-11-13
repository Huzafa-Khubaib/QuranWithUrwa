"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[60vh] flex-1 items-center justify-center px-3 py-16 sm:px-4">
      <ClayCard color="yellow" className="mx-auto w-full max-w-lg p-8 text-center sm:p-10">
        <span className="clay-sm mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#FFFAF3]">
          <AlertTriangle className="size-6 text-ink" aria-hidden />
        </span>
        <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-muted">
          We hit an unexpected error. Try again — if it keeps happening, message
          us on WhatsApp from the contact page.
        </p>
        {error.digest ? (
          <p className="mt-2 text-[11px] font-semibold text-ink/40">
            Ref: {error.digest}
          </p>
        ) : null}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ClayButton type="button" variant="primary" size="lg" onClick={reset}>
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </ClayButton>
          <ClayButton href="/" variant="outline" size="lg">
            Go home
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
