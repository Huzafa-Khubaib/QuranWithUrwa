import Link from "next/link";
import { cn } from "@/lib/utils";

type ClayButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "peach" | "mint" | "outline" | "whatsapp";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-105 active:translate-y-0.5",
  secondary:
    "bg-soft-yellow text-ink hover:brightness-105 active:translate-y-0.5",
  peach: "bg-peach text-ink hover:brightness-105 active:translate-y-0.5",
  mint: "bg-mint text-ink hover:brightness-105 active:translate-y-0.5",
  outline:
    "bg-[#FFFaf3]/80 text-ink border-2 border-ink/10 hover:bg-[#FFFaf3] active:translate-y-0.5",
  whatsapp:
    "bg-[#25D366] text-white hover:brightness-105 active:translate-y-0.5",
};

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function ClayButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  type = "button",
  disabled,
  onClick,
}: ClayButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-extrabold clay-sm transition-all disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
