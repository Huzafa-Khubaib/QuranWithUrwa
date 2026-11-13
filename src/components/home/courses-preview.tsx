"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { colorClasses, courses } from "@/lib/courses";
import { cn } from "@/lib/utils";

export function CoursesPreview() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4 sm:py-16">
      <SectionHeading
        eyebrow="Courses"
        arabic="دوراتنا"
        title="Grow with every lesson"
        description="From first letters to Hifz — gentle paths designed for young hearts and curious minds."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => (
          <motion.div
            key={course.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={`/courses#${course.slug}`} className="block h-full">
              <ClayCard
                color={course.color === "cream" ? "cream" : course.color}
                className={cn(
                  "flex h-full flex-col p-5 transition-transform hover:-translate-y-1",
                  colorClasses[course.color]
                )}
              >
                <p className="font-arabic text-xl text-ink/70" dir="rtl">
                  {course.arabic}
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-ink">
                  {course.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {course.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-ink">
                  Learn more <ArrowRight className="size-4" aria-hidden />
                </span>
              </ClayCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <ClayButton href="/courses" variant="outline" size="lg">
          View all courses
        </ClayButton>
      </div>
    </section>
  );
}
