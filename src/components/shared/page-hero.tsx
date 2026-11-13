"use client";

import { motion } from "framer-motion";
import { ClayCard } from "@/components/shared/clay-card";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  arabic?: string;
  color?: "peach" | "mint" | "yellow" | "sky";
};

export function PageHero({
  eyebrow,
  title,
  description,
  arabic,
  color = "peach",
}: PageHeroProps) {
  return (
    <section className="px-3 pt-6 sm:px-4 sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <ClayCard color={color} className="mx-auto max-w-6xl p-6 sm:p-8 md:p-10">
          {eyebrow ? (
            <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
              {eyebrow}
            </p>
          ) : null}
          {arabic ? (
            <p className="font-arabic mt-1 text-2xl text-ink/70" dir="rtl">
              {arabic}
            </p>
          ) : null}
          <h1 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-ink sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {description}
          </p>
        </ClayCard>
      </motion.div>
    </section>
  );
}
