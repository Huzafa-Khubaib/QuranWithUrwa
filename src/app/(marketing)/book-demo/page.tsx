import { PageHero } from "@/components/shared/page-hero";
import { ClayCard } from "@/components/shared/clay-card";
import { AcademyRequestForm } from "@/components/forms/academy-request-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Book a Free Demo",
  description:
    "Book a free demo class at Quran With Urwa — tell us about your child and preferred time.",
  path: "/book-demo",
});

export default function BookDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Free demo"
        arabic="احجز حصة تجريبية"
        title="Book a free demo class"
        description="Share a few details and we’ll match a gentle teacher for a short Meet or Zoom trial."
        color="mint"
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-3 py-10 sm:px-4 sm:py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <ClayCard color="peach" className="h-fit p-6 sm:p-7">
          <h2 className="text-lg font-black text-ink">What to expect</h2>
          <ul className="mt-4 space-y-3 text-sm font-semibold leading-relaxed text-ink-muted">
            <li>15–20 minute friendly trial on Google Meet or Zoom</li>
            <li>Teacher observes level and suggests the right course</li>
            <li>No payment required for the demo</li>
            <li>We’ll confirm on WhatsApp after reviewing your request</li>
          </ul>
        </ClayCard>

        <AcademyRequestForm kind="demo" />
      </section>
    </>
  );
}
