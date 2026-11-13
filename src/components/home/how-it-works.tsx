"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { ClayCard } from "@/components/shared/clay-card";

const steps = [
  {
    step: "01",
    title: "Book a free demo",
    body: "Tell us your child’s age and goals. We’ll schedule a friendly trial class.",
    color: "peach" as const,
  },
  {
    step: "02",
    title: "Meet your teacher",
    body: "Join on Google Meet or Zoom. Feel the teaching style before you enroll.",
    color: "mint" as const,
  },
  {
    step: "03",
    title: "Learn & grow",
    body: "Pick a plan, get your class links, and revisit recordings anytime in the portal.",
    color: "sky" as const,
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4 sm:py-16">
      <SectionHeading
        eyebrow="Simple path"
        title="How it works"
        description="Three soft steps from hello to consistent Quran learning."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <ClayCard color={step.color} className="h-full p-6">
              <p className="text-4xl font-black text-ink/25">{step.step}</p>
              <h3 className="mt-3 text-xl font-extrabold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </ClayCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
