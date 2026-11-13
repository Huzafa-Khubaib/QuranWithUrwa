import { z } from "zod";
import { countries } from "@/lib/countries";

/** Keep in sync with course titles in `lib/courses.ts`. */
export const courseInterestOptions = [
  "Noorani Qaida",
  "Nazra Quran",
  "Tajweed",
  "Hifz Program",
  "Duas & Surahs",
  "Not sure yet",
] as const;

export const preferredTimeOptions = [
  "Morning (before 12pm)",
  "Afternoon (12pm–5pm)",
  "Evening (5pm–9pm)",
  "Flexible / discuss",
] as const;

export const academyRequestSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Please enter the parent’s name")
    .max(80, "Name is too long"),
  childName: z
    .string()
    .trim()
    .min(2, "Please enter the child’s name")
    .max(80, "Name is too long"),
  childAge: z
    .number({ error: "Please enter the child’s age" })
    .int("Age must be a whole number")
    .min(3, "Child must be at least 3")
    .max(99, "Please enter a valid age"),
  whatsappNumber: z
    .string()
    .trim()
    .min(8, "Enter a valid WhatsApp number")
    .max(20, "Number is too long")
    .regex(/^[+\d\s()-]+$/, "Use digits and + ( ) - only"),
  email: z.string().trim().email("Enter a valid email address").max(120),
  country: z.enum(countries, { error: "Please select a country" }),
  courseInterest: z.enum(courseInterestOptions, {
    error: "Please select a course",
  }),
  preferredTime: z.enum(preferredTimeOptions, {
    error: "Please select a preferred time",
  }),
  message: z.string().max(1000, "Message is too long").default(""),
  /** Honeypot — humans leave empty; bots that fill it get a fake success. */
  website: z.string().max(200).default(""),
});

export type AcademyRequestInput = z.infer<typeof academyRequestSchema>;
export type AcademyRequestPayload = Omit<AcademyRequestInput, "website">;
