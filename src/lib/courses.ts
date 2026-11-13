export type Course = {
  slug: string;
  title: string;
  arabic: string;
  description: string;
  level: string;
  duration: string;
  color: "peach" | "mint" | "yellow" | "sky" | "cream";
  highlights: string[];
};

export const courses: Course[] = [
  {
    slug: "noorani-qaida",
    title: "Noorani Qaida",
    arabic: "نورانی قاعدہ",
    description:
      "Perfect start for kids and absolute beginners — learn Arabic letters, sounds, and joining with fun, patient guidance.",
    level: "Beginner",
    duration: "2–4 months",
    color: "peach",
    highlights: ["Letter recognition", "Basic sounds", "Joining practice", "Reading readiness"],
  },
  {
    slug: "nazra",
    title: "Nazra Quran",
    arabic: "ناظرہ قرآن",
    description:
      "Fluent reading of the Holy Quran with clear pronunciation and steady pace, building confidence page by page.",
    level: "Beginner–Intermediate",
    duration: "6–12 months",
    color: "mint",
    highlights: ["Fluency", "Word recognition", "Daily practice plan", "Progress tracking"],
  },
  {
    slug: "tajweed",
    title: "Tajweed",
    arabic: "تجوید",
    description:
      "Beautify your recitation with proper rules of Tajweed — makharij, madd, and articulation made simple.",
    level: "Intermediate",
    duration: "4–8 months",
    color: "yellow",
    highlights: ["Makharij", "Rules of noon & meem", "Madd & stops", "Beautiful recitation"],
  },
  {
    slug: "hifz",
    title: "Hifz Program",
    arabic: "حفظ القرآن",
    description:
      "Structured memorization with revision cycles, teacher check-ins, and a gentle pace suited for each student.",
    level: "All levels",
    duration: "Flexible",
    color: "sky",
    highlights: ["New lesson + revision", "Memory techniques", "Weekly goals", "Parent updates"],
  },
  {
    slug: "duas",
    title: "Duas & Surahs",
    arabic: "أدعية و سور",
    description:
      "Essential daily duas and short surahs with meaning — ideal for younger learners and new Muslims.",
    level: "All ages",
    duration: "Ongoing",
    color: "cream",
    highlights: ["Daily duas", "Short surahs", "Meanings", "Practical use"],
  },
];

export const feePlans = [
  {
    name: "Starter",
    sessions: "2 / week",
    price: "$25",
    period: "/ month",
    color: "peach" as const,
    features: ["30-min live classes", "1 course focus", "Recording access", "WhatsApp support"],
    popular: false,
  },
  {
    name: "Growth",
    sessions: "3 / week",
    price: "$35",
    period: "/ month",
    color: "mint" as const,
    features: [
      "45-min live classes",
      "Progress reports",
      "Recording access",
      "Priority scheduling",
      "Parent portal updates",
    ],
    popular: true,
  },
  {
    name: "Intensive",
    sessions: "5 / week",
    price: "$55",
    period: "/ month",
    color: "sky" as const,
    features: [
      "45–60 min classes",
      "Hifz-ready pacing",
      "Dedicated teacher",
      "Weekly parent call",
      "Full recording library",
    ],
    popular: false,
  },
];

export const colorClasses: Record<Course["color"], string> = {
  peach: "bg-peach",
  mint: "bg-mint",
  yellow: "bg-soft-yellow",
  sky: "bg-sky",
  cream: "bg-[#FFF8EE]",
};
