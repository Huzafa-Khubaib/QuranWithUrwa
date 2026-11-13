"use client";

import { motion } from "framer-motion";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";

export function TeacherIntro() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <ClayCard
          color="yellow"
          className="grid items-center gap-8 overflow-hidden p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:p-10"
        >
          <div className="flex justify-center">
            <div className="clay relative flex size-44 items-center justify-center rounded-[2rem] bg-peach sm:size-52">
              <div className="text-center">
                <div className="mx-auto mb-2 flex size-20 items-center justify-center rounded-full bg-[#FFFAF3] text-3xl font-black text-ink">
                  ن
                </div>
                <p className="text-sm font-extrabold text-ink">Ustadha Urwa</p>
                <p className="text-xs font-semibold text-ink-muted">Lead Teacher</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
              Meet your teacher
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Guided with care & clarity
            </h2>
            <p className="font-arabic mt-2 text-xl text-ink/70" dir="rtl">
              معلمة محبة للقرآن
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
              Our teachers are trained in Tajweed and child pedagogy. Classes stay
              interactive, age-aware, and rooted in respect — so every student feels
              seen, supported, and excited to open the Mushaf again tomorrow.
            </p>
            <div className="mt-6">
              <ClayButton href="/about" variant="peach" size="lg">
                About our team
              </ClayButton>
            </div>
          </div>
        </ClayCard>
      </motion.div>
    </section>
  );
}
