import type { RegistrationStatus } from "@/lib/supabase/types";

// Single source of truth for status visuals (custom palette per RSVP-4 spec).
// checked_in is added in RSVP-6 when it can actually be displayed.
export const STATUS_STYLES: Record<
  RegistrationStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "#DEDFE0", text: "#44443F" },
  approved: { label: "Approved", bg: "#68F278", text: "#173404" },
  rejected: { label: "Rejected", bg: "#69605F", text: "#F1EFE8" },
};

export const SELECTED_ROW_BG = "#E0EEFF";

export const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export function isStatusFilter(value: string | undefined): value is StatusFilter {
  return value !== undefined && (STATUS_FILTERS as readonly string[]).includes(value);
}
