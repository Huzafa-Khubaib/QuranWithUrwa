"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";
import { RequestSuccess } from "@/components/forms/request-success";
import { Label } from "@/components/ui/label";
import { countries } from "@/lib/countries";
import {
  academyRequestSchema,
  courseInterestOptions,
  preferredTimeOptions,
  type AcademyRequestInput,
} from "@/lib/validators/academy-request";
import { cn } from "@/lib/utils";

type AcademyRequestFormProps = {
  kind: "demo" | "enrollment";
};

type FormValues = {
  parentName: string;
  childName: string;
  childAge: number | undefined;
  whatsappNumber: string;
  email: string;
  country: AcademyRequestInput["country"] | "";
  courseInterest: AcademyRequestInput["courseInterest"] | "";
  preferredTime: AcademyRequestInput["preferredTime"] | "";
  message: string;
  website: string;
};

const fieldClass =
  "clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:ring-2 focus:ring-primary/30 disabled:opacity-60";

const errorClass = "mt-1 text-xs font-bold text-red-600";

export function AcademyRequestForm({ kind }: AcademyRequestFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(academyRequestSchema) as Resolver<FormValues>,
    defaultValues: {
      parentName: "",
      childName: "",
      childAge: undefined,
      whatsappNumber: "",
      email: "",
      country: "",
      courseInterest: "",
      preferredTime: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const endpoint =
      kind === "demo" ? "/api/demo-requests" : "/api/enrollment-requests";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        const msg = json.error ?? "Something went wrong. Please try again.";
        setServerError(msg);
        toast.error(msg);
        return;
      }

      toast.success(
        kind === "demo"
          ? "Demo request sent — we’ll WhatsApp you soon."
          : "Enrollment request sent — our team will follow up."
      );
      setSuccessName(values.parentName);
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      setServerError(msg);
      toast.error(msg);
    }
  }

  if (successName !== null) {
    return <RequestSuccess kind={kind} parentName={successName} />;
  }

  return (
    <ClayCard color="white" className="relative p-5 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Honeypot — hidden from humans */}
        <div
          className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor={`${kind}-website`}>Website</label>
          <input
            id={`${kind}-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Parent name"
            error={errors.parentName?.message}
            htmlFor={`${kind}-parentName`}
          >
            <input
              id={`${kind}-parentName`}
              className={fieldClass}
              placeholder="Parent / guardian name"
              autoComplete="name"
              {...register("parentName")}
            />
          </Field>

          <Field
            label="Child name"
            error={errors.childName?.message}
            htmlFor={`${kind}-childName`}
          >
            <input
              id={`${kind}-childName`}
              className={fieldClass}
              placeholder="Student’s name"
              {...register("childName")}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Child age"
            error={errors.childAge?.message}
            htmlFor={`${kind}-childAge`}
          >
            <input
              id={`${kind}-childAge`}
              type="number"
              min={3}
              max={99}
              inputMode="numeric"
              className={fieldClass}
              placeholder="e.g. 7"
              {...register("childAge", { valueAsNumber: true })}
            />
          </Field>

          <Field
            label="WhatsApp number"
            error={errors.whatsappNumber?.message}
            htmlFor={`${kind}-whatsapp`}
          >
            <input
              id={`${kind}-whatsapp`}
              className={fieldClass}
              placeholder="+92 300 1234567"
              autoComplete="tel"
              {...register("whatsappNumber")}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            error={errors.email?.message}
            htmlFor={`${kind}-email`}
          >
            <input
              id={`${kind}-email`}
              type="email"
              className={fieldClass}
              placeholder="you@email.com"
              autoComplete="email"
              {...register("email")}
            />
          </Field>

          <Field
            label="Country"
            error={errors.country?.message}
            htmlFor={`${kind}-country`}
          >
            <select
              id={`${kind}-country`}
              className={cn(fieldClass, "appearance-none")}
              defaultValue=""
              {...register("country")}
            >
              <option value="" disabled>
                Select country
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Course interest"
            error={errors.courseInterest?.message}
            htmlFor={`${kind}-course`}
          >
            <select
              id={`${kind}-course`}
              className={cn(fieldClass, "appearance-none")}
              defaultValue=""
              {...register("courseInterest")}
            >
              <option value="" disabled>
                Select a course
              </option>
              {courseInterestOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Preferred time"
            error={errors.preferredTime?.message}
            htmlFor={`${kind}-time`}
          >
            <select
              id={`${kind}-time`}
              className={cn(fieldClass, "appearance-none")}
              defaultValue=""
              {...register("preferredTime")}
            >
              <option value="" disabled>
                Select a time
              </option>
              {preferredTimeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Message (optional)"
          error={errors.message?.message}
          htmlFor={`${kind}-message`}
        >
          <textarea
            id={`${kind}-message`}
            rows={4}
            className={cn(fieldClass, "resize-none")}
            placeholder="Goals, timezone, siblings, questions…"
            {...register("message")}
          />
        </Field>

        {serverError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {serverError}
          </p>
        ) : null}

        <ClayButton
          type="submit"
          variant={kind === "demo" ? "primary" : "peach"}
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : kind === "demo" ? (
            "Book free demo"
          ) : (
            "Submit enrollment"
          )}
        </ClayButton>
      </form>
    </ClayCard>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="mb-1.5 text-xs font-extrabold tracking-wide text-ink uppercase"
      >
        {label}
      </Label>
      {children}
      {error ? <p className={errorClass}>{error}</p> : null}
    </div>
  );
}
