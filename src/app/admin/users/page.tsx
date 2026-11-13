import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { ClayCard } from "@/components/shared/clay-card";

export const metadata: Metadata = {
  title: "Create User",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<p className="text-sm font-bold text-ink-muted">Loading…</p>}>
      <UsersContent />
    </Suspense>
  );
}

async function UsersContent() {
  await connection();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Create user</h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Manually invite teachers, students, or extra admins. Approving a request
          also creates a student automatically.
        </p>
      </div>
      <CreateUserForm />
      <ClayCard color="yellow" className="p-5 text-sm font-semibold text-ink-muted">
        Tip: after creating a teacher, open Classes → assign them and set the
        Meet/Zoom link, then add students to the roster.
      </ClayCard>
    </div>
  );
}
