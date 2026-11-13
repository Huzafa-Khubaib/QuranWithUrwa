import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type BrandMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizePx = {
  sm: 36,
  md: 44,
  lg: 56,
} as const;

const sizeClass = {
  sm: "size-9 rounded-[0.9rem]",
  md: "size-11 rounded-[1.05rem]",
  lg: "size-14 rounded-[1.25rem]",
} as const;

/** Brand mark image — crescent + open mushaf */
export function BrandMark({ className, size = "md" }: BrandMarkProps) {
  const px = sizePx[size];
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden",
        "ring-1 ring-ink/10 shadow-[0_8px_18px_-10px_rgba(61,44,41,0.4)]",
        sizeClass[size],
        className
      )}
      aria-hidden
    >
      <Image
        src="/brand-mark.jpg"
        alt=""
        width={px}
        height={px}
        className="size-full object-cover"
        priority
      />
    </span>
  );
}

type BrandLogoProps = {
  href?: string;
  className?: string;
  markSize?: "sm" | "md" | "lg";
  showArabic?: boolean;
  subtitle?: string;
  compact?: boolean;
};

export function BrandLogo({
  href = "/",
  className,
  markSize = "md",
  showArabic = true,
  subtitle,
  compact = false,
}: BrandLogoProps) {
  const content = (
    <>
      <BrandMark size={markSize} />
      <span className="min-w-0 leading-[1.15]">
        <span
          className={cn(
            "block truncate font-black tracking-tight text-ink",
            compact ? "text-[0.8125rem]" : "text-sm sm:text-base"
          )}
        >
          Quran With Urwa
        </span>
        {subtitle ? (
          <span className="mt-0.5 block text-[11px] font-bold tracking-wide text-ink-muted">
            {subtitle}
          </span>
        ) : showArabic ? (
          <span
            className={cn(
              "font-arabic mt-0.5 block text-ink-muted/90",
              compact ? "text-[11px]" : "hidden text-[0.8rem] sm:block"
            )}
            dir="rtl"
          >
            {siteConfig.nameArabic}
          </span>
        ) : null}
      </span>
    </>
  );

  if (!href) {
    return (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-w-0 items-center gap-2.5 transition-transform hover:scale-[1.01]",
        className
      )}
    >
      {content}
    </Link>
  );
}
