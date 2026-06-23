import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
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
        <RegistrationsView rows={rows ?? []} initialStatus={initialStatus} />
      )}
    </main>
  );
}
