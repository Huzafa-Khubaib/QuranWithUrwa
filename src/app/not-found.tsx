import Link from "next/link";
import { Home } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-logo";
import { ClayButton } from "@/components/shared/clay-button";
import { ClayCard } from "@/components/shared/clay-card";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center px-3 py-16 sm:px-4">
      <ClayCard
        color="peach"
        className="mx-auto w-full max-w-lg p-8 text-center sm:p-10"
      >
        <span className="mx-auto mb-4 inline-flex">
          <BrandMark size="lg" />
        </span>
        <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
          404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
          Page not found
        </h1>
        <p className="font-arabic mt-1 text-xl text-ink/70" dir="rtl">
          الصفحة غير موجودة
        </p>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-muted">
          This link doesn’t lead anywhere at {siteConfig.name}. Head home or
          book a free demo instead.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ClayButton href="/" variant="primary" size="lg">
            <Home className="size-4" aria-hidden />
            Go home
          </ClayButton>
          <ClayButton href="/book-demo" variant="secondary" size="lg">
            Book a Free Demo
          </ClayButton>
        </div>
        <p className="mt-6 text-xs font-semibold text-ink-muted">
          Or{" "}
          <Link href="/contact" className="font-bold text-ink underline-offset-2 hover:underline">
            contact us
          </Link>
          .
        </p>
      </ClayCard>
    </div>
  );
}
