"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { ClayButton } from "@/components/shared/clay-button";
import { PageEnter } from "@/components/shared/motion";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Requests", icon: Inbox },
  { href: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/classes", label: "Classes", icon: School },
  { href: "/admin/fees", label: "Fees", icon: Wallet },
  { href: "/admin/users", label: "Create user", icon: ClipboardList },
] as const;

export function AdminShell({
  fullName,
  children,
}: {
  fullName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstName = fullName.trim().split(/\s+/)[0] || "Admin";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <aside className="clay flex h-full w-[min(260px,85vw)] flex-col rounded-[2rem] border border-white/50 bg-sky p-4">
      <div className="mb-6 flex items-center gap-3 px-1">
        <div className="clay-sm flex size-14 items-center justify-center rounded-full bg-[#FFFAF3] text-lg font-black text-ink">
          {firstName.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-ink">{firstName}</p>
          <p className="text-xs font-bold text-ink-muted">Admin control</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all",
                active
                  ? "clay-sm bg-[#FFFAF3] text-ink"
                  : "text-ink/70 hover:bg-[#FFFAF3]/45 hover:text-ink"
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="mt-3">
        <ClayButton type="submit" variant="outline" className="w-full bg-[#FFFAF3]/70">
          <LogOut className="size-4" aria-hidden />
          Log out
        </ClayButton>
      </form>
    </aside>
  );

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-[1400px] flex-1 gap-4 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 lg:p-5">
      <div className="sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 lg:block">
        {sidebar}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <header className="clay flex items-center gap-3 rounded-3xl border border-white/60 bg-[#FFFAF3]/90 px-3 py-3 backdrop-blur-md sm:px-4">
          <button
            type="button"
            className="clay-sm flex size-10 shrink-0 items-center justify-center rounded-2xl bg-peach lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="clay-inset flex min-w-0 flex-1 rounded-full bg-cream px-3 py-2.5 sm:px-4">
            <span className="truncate text-sm font-bold text-ink-muted">
              Quran With Urwa · admin
            </span>
          </div>
        </header>
        <PageEnter className="min-w-0 flex-1 pb-6">{children}</PageEnter>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/20"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute top-3 bottom-3 left-3"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative h-full">
                <button
                  type="button"
                  className="clay-sm absolute -top-1 -right-1 z-10 flex size-9 items-center justify-center rounded-full bg-[#FFFAF3]"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
                {sidebar}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
