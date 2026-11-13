import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  arabic?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  arabic,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-sm font-extrabold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      {arabic ? (
        <p className="font-arabic mb-2 text-2xl text-ink-muted/80" dir="rtl">
          {arabic}
        </p>
      ) : null}
      <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
