"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";
import { getWhatsAppUrl, siteConfig } from "@/lib/site";

type RequestSuccessProps = {
  kind: "demo" | "enrollment";
  parentName?: string;
};

export function RequestSuccess({ kind, parentName }: RequestSuccessProps) {
  const isDemo = kind === "demo";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <ClayCard color={isDemo ? "mint" : "peach"} className="mx-auto max-w-xl p-8 text-center sm:p-10">
        <span className="clay-sm mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[#FFFAF3]">
          <CheckCircle2 className="size-8 text-primary" aria-hidden />
        </span>
        <p className="font-arabic text-2xl text-ink/70" dir="rtl">
          جزاك الله خيراً
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
          {isDemo ? "Demo request received!" : "Enrollment request received!"}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          {parentName ? `Thank you, ${parentName}. ` : "Thank you. "}
          {isDemo
            ? "We’ll review your details and message you on WhatsApp to schedule a free demo class."
            : "We’ll confirm your plan, teacher match, and first class schedule soon."}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ClayButton href="/" variant="outline" size="lg">
            <Home className="size-4" aria-hidden />
            Back home
          </ClayButton>
          <ClayButton
            href={siteConfig.whatsappNumber ? getWhatsAppUrl() : "/contact"}
            variant="whatsapp"
            size="lg"
            external={Boolean(siteConfig.whatsappNumber)}
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp us
          </ClayButton>
        </div>
      </ClayCard>
    </motion.div>
  );
}
