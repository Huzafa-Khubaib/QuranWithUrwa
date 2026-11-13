import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ClayCard } from "@/components/shared/clay-card";
import { ClayButton } from "@/components/shared/clay-button";
import { getSessionProfile } from "@/lib/auth/get-profile";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default function StudentSettingsPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  await connection();
  const { profile } = await getSessionProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Your profile details from the academy.
        </p>
      </div>

      <ClayCard color="white" className="space-y-4 p-6">
        <Row label="Full name" value={profile.full_name || "—"} />
        <Row label="Role" value="Student" />
        <Row label="Phone" value={profile.phone || "Not set"} />
        <p className="text-xs font-semibold text-ink-muted">
          Need a name or phone change? Ask your admin — accounts are managed by
          the academy.
        </p>
        <ClayButton href="/forgot-password" variant="peach">
          Reset password
        </ClayButton>
      </ClayCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="clay-inset rounded-2xl bg-cream px-4 py-3">
      <p className="text-[11px] font-extrabold tracking-wide text-ink-muted uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
