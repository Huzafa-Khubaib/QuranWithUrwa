import type { Metadata } from "next";
import { CoursesPreview } from "@/components/home/courses-preview";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { TeacherIntro } from "@/components/home/teacher-intro";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoursesPreview />
      <WhyChooseUs />
      <HowItWorks />
      <TeacherIntro />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
