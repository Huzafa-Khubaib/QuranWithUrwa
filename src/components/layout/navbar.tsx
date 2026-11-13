"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ClayButton } from "@/components/shared/clay-button";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="clay mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-3xl border border-white/60 bg-[#FFFAF3]/90 px-4 py-3 backdrop-blur-md sm:px-5">
        <BrandLogo className="min-w-0" markSize="md" />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-mint text-ink clay-sm"
                    : "text-ink-muted hover:bg-cream hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <ClayButton href="/book-demo" variant="peach" size="md">
            Book a Free Demo
          </ClayButton>
        </div>

        <button
          type="button"
          className="clay-sm flex size-10 shrink-0 items-center justify-center rounded-2xl bg-peach md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="clay mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-white/60 bg-[#FFFAF3] p-4 md:hidden"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-bold",
                      active ? "bg-mint" : "hover:bg-cream"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <ClayButton
                href="/book-demo"
                variant="peach"
                className="mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                Book a Free Demo
              </ClayButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
