"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { saveCourseAction, type AdminActionState } from "@/lib/admin/actions";
import type { AdminCourse } from "@/lib/admin/types";

const initial: AdminActionState = {};

export function CourseForm({ course }: { course?: AdminCourse }) {
  const [state, formAction, pending] = useActionState(saveCourseAction, initial);
  useActionToast(state);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      {course ? <input type="hidden" name="id" value={course.id} /> : null}
      <label className="block sm:col-span-2">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Title</span>
        <input
          name="title"
          required
          defaultValue={course?.title}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Slug</span>
        <input
          name="slug"
          defaultValue={course?.slug}
          placeholder="auto from title"
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Arabic</span>
        <input
          name="arabicTitle"
          defaultValue={course?.arabic_title ?? ""}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
          dir="rtl"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Level</span>
        <input
          name="level"
          defaultValue={course?.level ?? ""}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Sort</span>
        <input
          name="sortOrder"
          type="number"
          defaultValue={course?.sort_order ?? 0}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Description</span>
        <textarea
          name="description"
          rows={2}
          defaultValue={course?.description ?? ""}
          className="clay-inset w-full resize-none rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-bold text-ink sm:col-span-2">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={course?.is_active ?? true}
          className="size-4 accent-primary"
        />
        Active
      </label>
      {state.error ? (
        <p className="text-sm font-bold text-red-700 sm:col-span-2">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm font-bold text-primary sm:col-span-2">{state.success}</p>
      ) : null}
      <ClayButton type="submit" variant="primary" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : course ? "Update course" : "Add course"}
      </ClayButton>
    </form>
  );
}
