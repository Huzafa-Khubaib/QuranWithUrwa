import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { navLinks, siteConfig, getWhatsAppUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto px-3 pb-24 pt-12 sm:px-4">
      <div className="clay mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/50 bg-mint/70">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-3">
              <BrandLogo href="/" markSize="md" showArabic />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              Soft, caring online Quran classes for kids and beginners. Live
              sessions on Google Meet or Zoom — we store your links and
              recordings in one friendly portal.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink">
              Explore
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login/student"
                  className="text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                >
                  Student login
                </Link>
              </li>
              <li>
                <Link
                  href="/login/teacher"
                  className="text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                >
                  Teacher login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink">
              Contact
            </p>
            <ul className="space-y-3 text-sm font-semibold text-ink-muted">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 hover:text-ink"
                >
                  <Mail className="size-4" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl()}
                  className="inline-flex items-center gap-2 hover:text-ink"
                  target={siteConfig.whatsappNumber ? "_blank" : undefined}
                  rel={siteConfig.whatsappNumber ? "noopener noreferrer" : undefined}
                >
                  <Phone className="size-4" aria-hidden />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink/5 px-6 py-4 text-center text-xs font-semibold text-ink-muted sm:px-8">
          © 2026 {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
