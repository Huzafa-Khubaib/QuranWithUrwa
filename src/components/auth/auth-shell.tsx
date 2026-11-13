import { ClayCard } from "@/components/shared/clay-card";
import { BrandLogo } from "@/components/shared/brand-logo";
import { LoginIllustration } from "@/components/auth/login-illustration";

type AuthShellProps = {
  children: React.ReactNode;
  accent?: "mint" | "peach" | "sky" | "yellow";
};

export function AuthShell({ children, accent = "mint" }: AuthShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-3 py-10 sm:px-4 sm:py-14">
      <BrandLogo
        href="/"
        className="mb-6 self-start"
        markSize="sm"
        showArabic={false}
        compact
      />

      <div className="grid items-stretch gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <ClayCard
          color={accent}
          className="hidden flex-col justify-between p-6 sm:p-8 md:flex"
        >
          <div>
            <p className="text-sm font-extrabold tracking-wide text-ink uppercase">
              Welcome back
            </p>
            <p className="font-arabic mt-2 text-2xl text-ink/70" dir="rtl">
              أهلاً وسهلاً
            </p>
            <p className="mt-3 max-w-xs text-sm font-semibold leading-relaxed text-ink-muted">
              Soft, safe access to your Quran classes — Meet/Zoom links and
              recordings stay in one place.
            </p>
          </div>
          <LoginIllustration className="mx-auto mt-4 h-auto w-full max-w-[280px]" />
        </ClayCard>

        <ClayCard color="white" className="p-6 sm:p-8">
          <div className="mb-4 flex justify-center md:hidden">
            <LoginIllustration className="h-auto w-40" />
          </div>
          {children}
        </ClayCard>
      </div>
    </div>
  );
}
