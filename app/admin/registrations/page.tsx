import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  STATUS_FILTERS,
  isStatusFilter,
  type StatusFilter,
} from "@/lib/status";
import { RegistrationsTable } from "./registrations-table";
import { signOut } from "./actions";

const PAGE_SIZE = 50;

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function pageHref(status: StatusFilter, page: number): string {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/registrations?${query}` : "/admin/registrations";
}

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const status: StatusFilter = isStatusFilter(params.status)
    ? params.status
    : "all";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("registrations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (status !== "all") query = query.eq("status", status);

  const { data: rows, count, error } = await query;
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

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

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter by status">
        {STATUS_FILTERS.map((filter) => {
          const active = filter === status;
          return (
            <Link
              key={filter}
              href={pageHref(filter, 1)}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "hover:bg-muted"
              }`}
            >
              {FILTER_LABELS[filter]}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            Could not load registrations. Please refresh the page.
          </div>
        ) : !rows || rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No registrations</p>
            <p className="text-sm text-muted-foreground">
              {status === "all"
                ? "Registrations will appear here once people sign up."
                : `No ${status} registrations.`}
            </p>
          </div>
        ) : (
          <RegistrationsTable rows={rows} />
        )}
      </div>

      {count && count > PAGE_SIZE ? (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={pageHref(status, page - 1)}
                className="rounded-md border px-3 py-1 hover:bg-muted"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-md border px-3 py-1 opacity-40">
                Previous
              </span>
            )}
            {page < totalPages ? (
              <Link
                href={pageHref(status, page + 1)}
                className="rounded-md border px-3 py-1 hover:bg-muted"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border px-3 py-1 opacity-40">
                Next
              </span>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
