import { Check } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { feePlans } from "@/lib/courses";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Fees",
  description: "Simple monthly plans for Quran With Urwa live classes.",
  path: "/fees",
});

export default function FeesPage() {
  return (
    <>
      <PageHero
        eyebrow="Fees"
        arabic="الرسوم والباقات"
        title="Simple plans for steady learning"
        description="All plans include live Meet/Zoom classes. Recordings and links live in your portal when shared by your teacher."
        color="yellow"
      />

      <section className="mx-auto max-w-6xl px-3 py-12 sm:px-4 sm:py-16">
        <div className="overflow-x-auto pb-2">
          <table className="mb-10 w-full min-w-[640px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-extrabold tracking-wide text-ink-muted uppercase">
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Sessions</th>
                <th className="px-4 py-2">Monthly</th>
                <th className="px-4 py-2">Best for</th>
              </tr>
            </thead>
            <tbody>
              {feePlans.map((plan) => (
                <tr key={plan.name} className="clay rounded-3xl bg-[#FFFAF3]">
                  <td className="rounded-l-3xl px-4 py-4 font-extrabold text-ink">
                    {plan.name}
                    {plan.popular ? (
                      <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[10px] font-black uppercase">
                        Popular
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-ink-muted">
                    {plan.sessions}
                  </td>
                  <td className="px-4 py-4 text-sm font-extrabold text-ink">
                    {plan.price}
                    <span className="font-semibold text-ink-muted">{plan.period}</span>
                  </td>
                  <td className="rounded-r-3xl px-4 py-4 text-sm text-ink-muted">
                    {plan.features[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {feePlans.map((plan) => (
            <ClayCard
              key={plan.name}
              color={plan.color}
              className={cn(
                "relative flex h-full flex-col p-6",
                plan.popular && "ring-2 ring-ink/10"
              )}
            >
              {plan.popular ? (
                <span className="clay-sm absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-[10px] font-black tracking-wide text-cream uppercase">
                  Most loved
                </span>
              ) : null}
              <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
                {plan.name}
              </p>
              <p className="mt-2 text-4xl font-black text-ink">
                {plan.price}
                <span className="text-base font-bold text-ink-muted">
                  {plan.period}
                </span>
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-muted">
                {plan.sessions}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm font-semibold text-ink"
                  >
                    <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <ClayButton
                href="/enroll"
                variant={plan.popular ? "primary" : "outline"}
                className="mt-6 w-full"
              >
                Enroll in {plan.name}
              </ClayButton>
            </ClayCard>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Sibling discounts and custom Hifz pacing available — ask us on WhatsApp.
        </p>
      </section>
    </>
  );
}
