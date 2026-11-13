"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ClayCard } from "@/components/shared/clay-card";
import { FadeIn } from "@/components/shared/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Where do live classes happen?",
    a: "On Google Meet or Zoom. The portal stores your class links and recordings — we don’t host the video call itself.",
  },
  {
    q: "Do you offer a free demo?",
    a: "Yes. Book a free demo so your child can meet the teacher and try a short lesson before enrolling.",
  },
  {
    q: "What ages do you teach?",
    a: "Mostly kids from age 5+, plus beginners of any age. We match pace and materials to each learner.",
  },
  {
    q: "Can parents watch recordings?",
    a: "When a session is recorded and shared by the teacher, you’ll find it securely in your student portal.",
  },
  {
    q: "How do payments work?",
    a: "Choose a monthly plan on the Fees page. We’ll confirm scheduling after enrollment and your free demo.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-3 py-14 sm:px-4 sm:py-16">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered softly"
        description="Everything you need to know before your first class."
      />
      <FadeIn>
        <ClayCard color="white" className="p-2 sm:p-4">
          <Accordion className="w-full">
            {faqs.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`item-${index}`}
                className="border-ink/5 px-3"
              >
                <AccordionTrigger className="text-left text-base font-extrabold text-ink hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-ink-muted">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ClayCard>
      </FadeIn>
    </section>
  );
}
