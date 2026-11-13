import { PageHero } from "@/components/shared/page-hero";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Quran With Urwa — our mission, teachers, and gentle approach to online Quran education.",
  path: "/about",
});

const values = [
  {
    title: "Calm before noise",
    body: "We keep classes calm, focused, and full of barakah — never rushed or harsh.",
    color: "peach" as const,
  },
  {
    title: "Parents as partners",
    body: "Clear updates, easy scheduling, and recordings you can revisit together.",
    color: "mint" as const,
  },
  {
    title: "Live, then archive",
    body: "Teaching happens on Meet/Zoom. Our portal simply keeps links and recordings tidy.",
    color: "sky" as const,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        arabic="من نحن"
        title="A soft place to love the Quran"
        description="Quran With Urwa helps kids and beginners build a lasting relationship with the Book of Allah — with warmth, structure, and joy."
        color="sky"
      />

      <section className="mx-auto max-w-6xl px-3 py-12 sm:px-4 sm:py-16">
        <ClayCard color="white" className="p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-black text-ink sm:text-3xl">
                Our story
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                We started Quran With Urwa for families who wanted online Quran
                classes that feel as gentle as a real classroom — pastel-soft,
                teacher-led, and free from tech overwhelm. Live sessions stay on
                Google Meet or Zoom; we built the portal to hold schedules, links,
                and recordings so learning never gets lost in chat threads.
              </p>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Roles are clear: admins manage the academy, teachers guide classes,
                and students (with parents) follow their path — Qaida to Hifz and
                beyond.
              </p>
            </div>
            <ClayCard color="peach" className="p-6 text-center sm:p-8">
              <p className="font-arabic text-3xl text-ink" dir="rtl">
                وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
              </p>
              <p className="mt-3 text-sm font-semibold text-ink-muted">
                “…and recite the Quran with measured recitation.”
              </p>
              <p className="mt-1 text-xs font-bold text-ink/50">Qur’an 73:4</p>
            </ClayCard>
          </div>
        </ClayCard>

        <div className="mt-14">
          <SectionHeading
            title="What we believe"
            description="Three promises that shape every lesson at Quran With Urwa."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((v) => (
              <ClayCard key={v.title} color={v.color} className="p-6">
                <h3 className="text-lg font-extrabold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {v.body}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <ClayButton href="/book-demo" variant="primary" size="lg">
            Book a Free Demo
          </ClayButton>
        </div>
      </section>
    </>
  );
}
