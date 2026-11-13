"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClayButton } from "@/components/shared/clay-button";
import { toggleQuizPublishAction } from "@/lib/teacher/actions";

export function PublishQuizButton({
  quizId,
  isPublished,
}: {
  quizId: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <ClayButton
      type="button"
      variant={isPublished ? "secondary" : "mint"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await toggleQuizPublishAction(quizId, !isPublished);
            toast.success(isPublished ? "Quiz unpublished" : "Quiz published");
          } catch {
            toast.error("Could not update quiz");
          }
        });
      }}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : isPublished ? (
        "Unpublish"
      ) : (
        "Publish"
      )}
    </ClayButton>
  );
}
