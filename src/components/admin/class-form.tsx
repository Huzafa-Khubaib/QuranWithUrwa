"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { useActionToast } from "@/components/shared/use-action-toast";
import { saveClassAction, type AdminActionState } from "@/lib/admin/actions";
import type { AdminClass, AdminCourse, AdminProfile } from "@/lib/admin/types";

const initial: AdminActionState = {};

export function ClassForm({
  classItem,
  courses,
  teachers,
}: {
  classItem?: AdminClass;
  courses: AdminCourse[];
  teachers: AdminProfile[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveClassAction, initial);
  useActionToast(state);

  useEffect(() => {
    if (state.id) router.push(`/admin/classes/${state.id}`);
  }, [state.id, router]);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      {classItem ? <input type="hidden" name="id" value={classItem.id} /> : null}

      <label className="block sm:col-span-2">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Title</span>
        <input
          name="title"
          required
          defaultValue={classItem?.title}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Course</span>
        <select
          name="courseId"
          required
          defaultValue={classItem?.course_id ?? ""}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        >
          <option value="" disabled>
            Select course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Teacher</span>
        <select
          name="teacherId"
          required
          defaultValue={classItem?.teacher_id ?? ""}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        >
          <option value="" disabled>
            Assign teacher
          </option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Platform</span>
        <select
          name="platform"
          defaultValue={classItem?.platform ?? "meet"}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        >
          <option value="meet">Google Meet</option>
          <option value="zoom">Zoom</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Start time</span>
        <input
          name="startTime"
          type="time"
          defaultValue={classItem?.start_time?.slice(0, 5) ?? "16:00"}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">
          Meet / Zoom link
        </span>
        <input
          name="meetingLink"
          type="url"
          defaultValue={classItem?.meeting_link ?? ""}
          placeholder="https://…"
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">
          Schedule days (comma)
        </span>
        <input
          name="scheduleDays"
          defaultValue={classItem?.schedule_days.join(", ") ?? "Mon, Wed"}
          placeholder="Mon, Wed, Fri"
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-extrabold uppercase text-ink">Duration (min)</span>
        <input
          name="duration"
          type="number"
          defaultValue={classItem?.duration_minutes ?? 45}
          className="clay-inset w-full rounded-2xl bg-cream px-4 py-3 text-sm font-semibold"
        />
      </label>

      {state.error ? (
        <p className="text-sm font-bold text-red-700 sm:col-span-2">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm font-bold text-primary sm:col-span-2">{state.success}</p>
      ) : null}

      <ClayButton type="submit" variant="primary" disabled={pending}>
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : classItem ? (
          "Update class"
        ) : (
          "Create class"
        )}
      </ClayButton>
    </form>
  );
}
