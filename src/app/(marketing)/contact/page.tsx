import { Mail, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { ContactForm } from "@/components/contact/contact-form";
import { createPageMetadata } from "@/lib/seo";
import { getWhatsAppUrl, siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Book a free demo or message Quran With Urwa on WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappHref = siteConfig.whatsappNumber
    ? getWhatsAppUrl()
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        arabic="تواصل معنا"
        title="Let’s plan your free demo"
        description="Tell us about your learner — we’ll match a teacher, time zone, and course path."
        color="peach"
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-3 py-12 sm:px-4 sm:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <ClayCard color="mint" className="p-6">
            <h2 className="text-lg font-black text-ink">Reach us directly</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-sm font-bold text-ink"
                >
                  <span className="clay-sm flex size-10 items-center justify-center rounded-2xl bg-[#FFFAF3]">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm font-bold text-ink">
                  <span className="clay-sm flex size-10 items-center justify-center rounded-2xl bg-[#FFFAF3]">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  {siteConfig.phoneDisplay}
                </span>
              </li>
            </ul>

            <ClayButton
              href={whatsappHref ?? "#"}
              variant="whatsapp"
              size="lg"
              className="mt-6 w-full"
              external={Boolean(whatsappHref)}
            >
              <MessageCircle className="size-5" aria-hidden />
              WhatsApp us
            </ClayButton>
            {!siteConfig.whatsappNumber ? (
              <p className="mt-3 text-xs font-semibold text-ink-muted">
                Set <code className="rounded bg-cream px-1">NEXT_PUBLIC_WHATSAPP_NUMBER</code> in
                .env.local to enable the WhatsApp button.
              </p>
            ) : null}
          </ClayCard>

          <ClayCard color="sky" className="p-6">
            <h3 className="font-extrabold text-ink">Class tip</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Live lessons run on Google Meet or Zoom. After enrollment, your
              class links and any shared recordings appear in the student portal.
            </p>
          </ClayCard>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
