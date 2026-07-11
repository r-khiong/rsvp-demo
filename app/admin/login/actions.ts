"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface DemoSignInFailure {
  error: string;
}

// One-click reviewer entry (RSVP-8). Credentials live ONLY in server-side env
// (DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD) so they never reach the client
// bundle. Read-only is enforced by a restrictive RLS policy at the database —
// this action only signs in; it grants nothing.
export async function signInAsDemo(): Promise<DemoSignInFailure> {
  const email = process.env.DEMO_ADMIN_EMAIL;
  const password = process.env.DEMO_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "signInAsDemo: DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD are not configured"
    );
    return { error: "Demo mode is not available right now." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("signInAsDemo: sign-in failed:", error.message);
    return { error: "Demo mode is not available right now." };
  }

  redirect("/admin/registrations");
}
