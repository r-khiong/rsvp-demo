"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface BatchResult {
  updated: number;
  skipped: number;
}

// Batch approve/reject. Idempotent: only rows whose status actually changes are
// updated (same-status rows are a no-op), and status_updated_at is written only
// on a real transition. RLS (authenticated) is the enforcement boundary.
export async function updateRegistrationsStatus(
  ids: string[],
  nextStatus: "approved" | "rejected"
): Promise<BatchResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (ids.length === 0) return { updated: 0, skipped: 0 };

  const { data: rows, error: readError } = await supabase
    .from("registrations")
    .select("id, status")
    .in("id", ids);
  if (readError) throw new Error(readError.message);

  const toUpdate = (rows ?? [])
    .filter((row) => row.status !== nextStatus)
    .map((row) => row.id);
  const skipped = ids.length - toUpdate.length;

  if (toUpdate.length === 0) return { updated: 0, skipped };

  const { error: updateError } = await supabase
    .from("registrations")
    .update({ status: nextStatus, status_updated_at: new Date().toISOString() })
    .in("id", toUpdate);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/registrations");
  return { updated: toUpdate.length, skipped };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
