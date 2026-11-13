"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-logo";
import { ClayButton } from "@/components/shared/clay-button";
import { KidIllustration } from "@/components/shared/kid-illustration";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="px-3 pt-6 sm:px-4 sm:pt-8">
      <motion.div
        className="clay relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/50 bg-peach md:grid-cols-[1.1fr_0.9fr]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="mb-5 flex items-center gap-3">
            <BrandMark size="lg" />
            <span className="clay-sm inline-flex w-fit items-center gap-2 rounded-full bg-[#FFFAF3]/80 px-3 py-1.5 text-xs font-extrabold text-ink">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              Online Quran for kids & beginners
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Quran With Urwa
          </h1>
          <p className="font-arabic mt-2 text-2xl text-ink/70" dir="rtl">
            {siteConfig.nameArabic}
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            Soft, joyful classes that nurture love for the Quran — live on Google
            Meet or Zoom, with recordings saved in your portal.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ClayButton href="/book-demo" variant="primary" size="lg">
              Book a Free Demo
            </ClayButton>
            <ClayButton href="/enroll" variant="secondary" size="lg">
              Enroll Now
            </ClayButton>
          </div>
        </div>

        <motion.div
          className="relative flex items-end justify-center px-4 pb-2 pt-2 md:pt-8"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <KidIllustration className="h-auto w-full max-w-[340px] drop-shadow-sm" />
        </motion.div>
      </motion.div>
    </section>
  );
}
