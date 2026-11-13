export const siteConfig = {
  name: "Quran With Urwa",
  nameArabic: "القرآن مع عروة",
  tagline: "Learn the Quran with love, light & care",
  description:
    "Online Quran classes for kids and beginners — Noorani Qaida, Nazra, Tajweed, Hifz, and Duas. Live sessions on Google Meet or Zoom.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappDefaultMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Assalamu Alaikum! I would like to book a free demo class at Quran With Urwa.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@quranwithurwa.com",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+92 300 0000000",
} as const;

export function getWhatsAppUrl(message?: string) {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  if (!number) return "#contact";
  const text = encodeURIComponent(message ?? siteConfig.whatsappDefaultMessage);
  return `https://wa.me/${number}?text=${text}`;
}

/** Open WhatsApp chat to a specific number (e.g. parent reply from admin). */
export function getWhatsAppUrlTo(phone: string, message?: string) {
  const number = phone.replace(/\D/g, "");
  if (!number) return "#";
  const text = encodeURIComponent(message ?? "");
  return `https://wa.me/${number}?text=${text}`;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/fees", label: "Fees" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
