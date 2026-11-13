"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getWhatsAppUrl, siteConfig } from "@/lib/site";

export function WhatsAppFloat() {
  const href = getWhatsAppUrl();
  const hasNumber = Boolean(siteConfig.whatsappNumber);

  return (
    <motion.a
      href={hasNumber ? href : "/contact"}
      target={hasNumber ? "_blank" : undefined}
      rel={hasNumber ? "noopener noreferrer" : undefined}
      aria-label="Chat on WhatsApp"
      className="clay fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-extrabold text-white sm:right-6 sm:bottom-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <MessageCircle className="size-5 fill-white/20" aria-hidden />
      <span className="hidden text-sm sm:inline">WhatsApp</span>
    </motion.a>
  );
}
