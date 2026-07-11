import { redirect } from "next/navigation";
import { CalendarCheck, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { isStatusFilter, type StatusFilter } from "@/lib/status";
import { RegistrationsView } from "./registrations-view";
import { signOut } from "./actions";

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // RSVP-8: demo session detection stays server-side — the email comparison
  // and the env var never reach the client. UI below is presentation only;
  // the real write ban is the restrictive RLS policy (rsvp8 migration).
  const isDemo =
    !!process.env.DEMO_ADMIN_EMAIL &&
    user.email === process.env.DEMO_ADMIN_EMAIL;

  const params = await searchParams;
  const initialStatus: StatusFilter = isStatusFilter(params.status)
    ? params.status
    : "all";

  const { data: rows, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <CalendarCheck className="h-5 w-5" />
          <span className="text-lg">RSVP Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      {isDemo && (
        <div
          role="status"
          className="mt-6 flex items-center gap-2 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground"
        >
          <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Demo mode (read-only) — batch actions disabled. Seeded demo data.
          </span>
        </div>
      )}

      <div className="mt-8 space-y-1">
        <h1 className="text-3xl font-bold">Registrations</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve or reject applicants.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Could not load registrations. Please refresh the page.
        </div>
      ) : (
        <RegistrationsView
          rows={rows ?? []}
          initialStatus={initialStatus}
          isDemo={isDemo}
        />
      )}
    </main>
  );
}
