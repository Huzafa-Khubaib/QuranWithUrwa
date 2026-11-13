import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { ClayCard } from "@/components/shared/clay-card";
import { AcademyRequestForm } from "@/components/forms/academy-request-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Enroll",
  description:
    "Enroll at Quran With Urwa — submit parent and student details to start your Quran journey.",
  path: "/enroll",
});

export default function EnrollPage() {
  return (
    <>
      <PageHero
        eyebrow="Enroll"
        arabic="سجّل الآن"
        title="Start your enrollment"
        description="Tell us about your learner. We’ll confirm plan, schedule, and teacher — then share Meet/Zoom links in your portal."
        color="peach"
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-3 py-10 sm:px-4 sm:py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <ClayCard color="sky" className="h-fit p-6 sm:p-7">
          <h2 className="text-lg font-black text-ink">Before you enroll</h2>
          <ul className="mt-4 space-y-3 text-sm font-semibold leading-relaxed text-ink-muted">
            <li>Pick a course interest — we can adjust after assessment</li>
            <li>
              Review{" "}
              <Link href="/fees" className="font-extrabold text-ink underline underline-offset-2">
                monthly plans
              </Link>{" "}
              anytime
            </li>
            <li>Prefer trying first?{" "}
              <Link href="/book-demo" className="font-extrabold text-ink underline underline-offset-2">
                Book a free demo
              </Link>
            </li>
            <li>Status starts as pending until an admin approves</li>
          </ul>
        </ClayCard>

        <AcademyRequestForm kind="enrollment" />
      </section>
    </>
  );
}
