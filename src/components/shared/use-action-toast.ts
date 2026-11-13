"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionFlash = {
  error?: string;
  success?: string;
};

/** Toast once when a server-action state gains success/error. */
export function useActionToast(state: ActionFlash | undefined | null) {
  const last = useRef<string>("");

  useEffect(() => {
    if (!state) return;
    const key = `${state.error ?? ""}|${state.success ?? ""}`;
    if (!key.replace("|", "") || key === last.current) return;
    last.current = key;

    if (state.error) toast.error(state.error);
    else if (state.success) toast.success(state.success);
  }, [state]);
}
