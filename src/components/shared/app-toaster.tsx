"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "clay !rounded-2xl !border-white/60 !bg-[#FFFAF3] !text-ink !font-sans",
          title: "!font-extrabold !text-ink",
          description: "!font-semibold !text-ink-muted",
          actionButton: "!bg-primary !text-primary-foreground !font-bold",
          cancelButton: "!bg-cream !text-ink !font-bold",
          closeButton: "!bg-[#FFFAF3] !border-ink/10",
        },
      }}
    />
  );
}
