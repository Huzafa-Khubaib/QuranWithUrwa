"use client";

import { motion } from "framer-motion";
import { Heart, MonitorPlay, ShieldCheck, Smile } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ClayCard } from "@/components/shared/clay-card";

const reasons = [
  {
    icon: Heart,
    title: "Child-first teaching",
    body: "Warm, patient teachers who make every class feel safe and encouraging.",
    color: "peach" as const,
  },
  {
    icon: MonitorPlay,
    title: "Meet & Zoom ready",
    body: "Live classes on the tools you already use — links and recordings stay in your portal.",
    color: "mint" as const,
  },
  {
    icon: ShieldCheck,
    title: "Trusted & structured",
    body: "Clear lesson plans, progress notes, and parent-friendly updates every week.",
    color: "sky" as const,
  },
  {
    icon: Smile,
    title: "Joyful learning",
    body: "Soft pastel space, playful pacing, and duas that stick with love — not pressure.",
    color: "yellow" as const,
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4 sm:py-16">
      <SectionHeading
        eyebrow="Why Urwa"
        title="Why families choose us"
        description="A calm, clay-soft classroom experience — serious about the Quran, gentle with every learner."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <ClayCard color={item.color} className="h-full p-5">
              <span className="clay-sm mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#FFFAF3]/80">
                <item.icon className="size-5 text-ink" aria-hidden />
              </span>
              <h3 className="text-lg font-extrabold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </ClayCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
