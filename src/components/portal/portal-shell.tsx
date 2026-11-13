import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import type { UserRole } from "@/lib/auth/roles";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ClayButton } from "@/components/shared/clay-button";

const roleLabel: Record<UserRole, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
};

type PortalShellProps = {
  role: UserRole;
  fullName: string;
  children: React.ReactNode;
};

export function PortalShell({ role, fullName, children }: PortalShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="clay mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-3xl border border-white/60 bg-[#FFFAF3]/90 px-4 py-3 backdrop-blur-md">
          <BrandLogo
            href={`/${role}`}
            markSize="md"
            showArabic={false}
            subtitle={`${roleLabel[role]} portal`}
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm font-bold text-ink-muted sm:inline">
              {fullName}
            </span>
            <form action={logoutAction}>
              <ClayButton type="submit" variant="outline" size="md">
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Log out</span>
              </ClayButton>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4 sm:py-8">
        {children}
      </div>
    </div>
  );
}
