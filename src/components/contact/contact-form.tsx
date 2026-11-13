"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Free Demo");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest, message, website }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !json.success) {
        const msg = json.error ?? "Could not send. Please try again.";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Message sent — we’ll reply by email soon.");
      setSent(true);
      setName("");
      setEmail("");
      setInterest("Free Demo");
      setMessage("");
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <ClayCard color="white" className="relative p-6 sm:p-8">
      <h2 className="text-xl font-black text-ink">Send a message</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Your message is emailed to our team automatically. We usually reply
        within a day.
      </p>

      {sent ? (
        <div className="mt-6 rounded-3xl bg-mint/60 px-5 py-6 text-center">
          <p className="text-lg font-extrabold text-ink">Message sent!</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            JazakAllah khair — we’ll get back to you on email soon.
          </p>
          <ClayButton
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setSent(false)}
          >
            Send another
          </ClayButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
              Name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="you@email.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
              Interest
            </span>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="clay-inset w-full rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>Free Demo</option>
              <option>Noorani Qaida</option>
              <option>Nazra</option>
              <option>Tajweed</option>
              <option>Hifz</option>
              <option>Duas & Surahs</option>
              <option>Fees / Enrollment</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-extrabold tracking-wide text-ink uppercase">
              Message
            </span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="clay-inset w-full resize-none rounded-2xl border border-ink/5 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Child’s age, preferred times, questions…"
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          ) : null}

          <ClayButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </ClayButton>
        </form>
      )}
    </ClayCard>
  );
}
