import { BookMarked, Clock, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { colorClasses, courses } from "@/lib/courses";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Courses",
  description:
    "Explore Noorani Qaida, Nazra, Tajweed, Hifz, and Duas at Quran With Urwa.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses"
        arabic="برامجنا التعليمية"
        title="Programs that grow with every student"
        description="Five gentle pathways — from first letters to memorization — taught live on Meet or Zoom."
        color="mint"
      />

      <section className="mx-auto max-w-6xl space-y-6 px-3 py-12 sm:px-4 sm:py-16">
        {courses.map((course) => (
          <ClayCard
            key={course.slug}
            id={course.slug}
            color={course.color === "cream" ? "cream" : course.color}
            className={cn("scroll-mt-28 p-6 sm:p-8", colorClasses[course.color])}
            as="article"
          >
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
              <div>
                <p className="font-arabic text-2xl text-ink/70" dir="rtl">
                  {course.arabic}
                </p>
                <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
                  {course.title}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
                  {course.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {course.highlights.map((h) => (
                    <li
                      key={h}
                      className="clay-sm rounded-full bg-[#FFFAF3]/85 px-3 py-1.5 text-xs font-extrabold text-ink"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="clay-inset space-y-3 rounded-3xl bg-[#FFFAF3]/55 p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <GraduationCap className="size-4" aria-hidden />
                  Level: {course.level}
                </p>
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Clock className="size-4" aria-hidden />
                  Typical duration: {course.duration}
                </p>
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <BookMarked className="size-4" aria-hidden />
                  Live class + portal recordings
                </p>
                <ClayButton href="/book-demo" variant="primary" className="mt-2 w-full">
                  Book demo for {course.title}
                </ClayButton>
              </div>
            </div>
          </ClayCard>
        ))}
      </section>
    </>
  );
}
