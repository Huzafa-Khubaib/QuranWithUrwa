"use client";

import { useActionState } from "react";
import { Check, Loader2, MessageCircle, X } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import {
  updateRequestStatusAction,
  type AdminActionState,
} from "@/lib/admin/actions";
import type { IntakeRequest } from "@/lib/admin/types";
import { getWhatsAppUrlTo } from "@/lib/site";

const initial: AdminActionState = {};

export function RequestActions({ request }: { request: IntakeRequest }) {
  const [state, formAction, pending] = useActionState(
    updateRequestStatusAction,
    initial
  );
  useActionToast(state);

  const waMessage = `Assalamu Alaikum ${request.parent_name}! This is Quran With Urwa regarding ${request.child_name}'s ${request.kind} request (${request.course_interest}).`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {request.status === "pending" ? (
          <>
            <form action={formAction}>
              <input type="hidden" name="kind" value={request.kind} />
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="status" value="approved" />
              <ClayButton type="submit" variant="primary" disabled={pending}>
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Check className="size-4" aria-hidden />
                )}
                Approve
              </ClayButton>
            </form>
            <form action={formAction}>
              <input type="hidden" name="kind" value={request.kind} />
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="status" value="rejected" />
              <ClayButton type="submit" variant="outline" disabled={pending}>
                <X className="size-4" aria-hidden />
                Reject
              </ClayButton>
            </form>
          </>
        ) : (
          <span className="clay-sm rounded-full bg-cream px-3 py-1.5 text-xs font-extrabold uppercase text-ink">
            {request.status}
          </span>
        )}

        <ClayButton
          href={getWhatsAppUrlTo(request.whatsapp_number, waMessage)}
          external
          variant="whatsapp"
        >
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp reply
        </ClayButton>
      </div>

      {state.error ? (
        <p className="text-xs font-bold text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-xs font-bold text-primary">{state.success}</p>
      ) : null}
    </div>
  );
}
