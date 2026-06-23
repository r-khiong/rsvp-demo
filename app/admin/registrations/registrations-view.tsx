"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import { STATUS_FILTERS, type StatusFilter } from "@/lib/status";
import type { Database } from "@/lib/supabase/types";
import { RegistrationsTable } from "./registrations-table";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function filterHref(filter: StatusFilter): string {
  return filter === "all"
    ? "/admin/registrations"
    : `/admin/registrations?status=${filter}`;
}

export function RegistrationsView({
  rows,
  initialStatus,
}: {
  rows: Registration[];
  initialStatus: StatusFilter;
}) {
  const [filter, setFilter] = useState<StatusFilter>(initialStatus);

  function selectFilter(next: StatusFilter) {
    setFilter(next);
    // Keep the URL shareable/refresh-safe without triggering a navigation,
    // so the surrounding frame never re-renders or jumps.
    window.history.replaceState(null, "", filterHref(next));
  }

  const filtered =
    filter === "all" ? rows : rows.filter((row) => row.status === filter);

  return (
    <>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter by status">
        {STATUS_FILTERS.map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              onClick={() => selectFilter(option)}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              {FILTER_LABELS[option]}
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No registrations</p>
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "Registrations will appear here once people sign up."
                : `No ${filter} registrations.`}
            </p>
          </div>
        ) : (
          <RegistrationsTable key={filter} rows={filtered} />
        )}
      </div>
    </>
  );
}
