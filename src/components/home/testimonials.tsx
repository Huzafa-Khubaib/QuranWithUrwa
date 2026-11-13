"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ClayCard } from "@/components/shared/clay-card";

const testimonials = [
  {
    name: "Ayesha K.",
    role: "Parent of 7-year-old",
    quote:
      "My daughter looks forward to every class. The teacher is so patient, and the recordings help us revise together at home.",
    color: "peach" as const,
  },
  {
    name: "Omar R.",
    role: "Parent of twins",
    quote:
      "Booking was easy, Meet links are always ready, and both kids are reading Qaida with confidence now. Alhamdulillah.",
    color: "mint" as const,
  },
  {
    name: "Fatima S.",
    role: "Adult learner",
    quote:
      "I started Tajweed as a beginner adult. The pace is kind, the feedback is clear, and I finally enjoy my recitation.",
    color: "sky" as const,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4 sm:py-16">
      <SectionHeading
        eyebrow="Love notes"
        title="Families who grew with Urwa"
        description="Real stories from parents and learners in our soft classroom."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <ClayCard color={t.color} className="flex h-full flex-col p-6">
              <Quote className="size-8 text-ink/20" aria-hidden />
              <p className="mt-3 flex-1 text-sm leading-relaxed font-semibold text-ink">
                “{t.quote}”
              </p>
              <div className="mt-5 border-t border-ink/10 pt-4">
                <p className="font-extrabold text-ink">{t.name}</p>
                <p className="text-xs font-semibold text-ink-muted">{t.role}</p>
              </div>
            </ClayCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
