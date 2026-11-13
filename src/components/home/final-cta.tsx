"use client";

import { motion } from "framer-motion";
import { ClayButton } from "@/components/shared/clay-button";
import { getWhatsAppUrl, siteConfig } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4 sm:pb-8 sm:pt-6">
      <motion.div
        className="clay overflow-hidden rounded-[2rem] border border-white/50 bg-sky p-8 text-center sm:p-12"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="font-arabic text-2xl text-ink/70" dir="rtl">
          ابدأ رحلتك مع القرآن
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Ready to begin with Urwa?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-ink-muted">
          Book a free demo today — or message us on WhatsApp and we’ll help you
          pick the right course and schedule.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ClayButton href="/book-demo" variant="primary" size="lg">
            Book a Free Demo
          </ClayButton>
          <ClayButton
            href={siteConfig.whatsappNumber ? getWhatsAppUrl() : "/contact"}
            variant="whatsapp"
            size="lg"
            external={Boolean(siteConfig.whatsappNumber)}
          >
            Chat on WhatsApp
          </ClayButton>
        </div>
      </motion.div>
    </section>
  );
}
