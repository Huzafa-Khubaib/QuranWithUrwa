import { cn } from "@/lib/utils";

type ClayCardProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
  color?: "cream" | "peach" | "mint" | "yellow" | "sky" | "white";
  inset?: boolean;
  as?: "div" | "article" | "section";
};

const colorMap = {
  cream: "bg-cream",
  peach: "bg-peach",
  mint: "bg-mint",
  yellow: "bg-soft-yellow",
  sky: "bg-sky",
  white: "bg-[#FFFaf3]",
};

export function ClayCard({
  children,
  className,
  color = "white",
  inset = false,
  as: Tag = "div",
  ...props
}: ClayCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-white/50",
        colorMap[color],
        inset ? "clay-inset" : "clay",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
