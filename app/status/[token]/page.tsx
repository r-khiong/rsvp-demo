import { notFound } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RegistrationStatus } from "@/lib/supabase/types";

const statusVariant: Record<
  RegistrationStatus,
  "secondary" | "default" | "destructive"
> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const statusLabel: Record<RegistrationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default async function StatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data, error } = await supabase
    .from("registrations")
    .select("*, events(*)")
    .eq("token", token)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 font-semibold">
          <CalendarCheck className="h-5 w-5" />
          <span className="text-lg">RSVP Demo</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Registration submitted</CardTitle>
            <CardDescription>Here&apos;s the status of your RSVP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant={statusVariant[data.status]}>
                {statusLabel[data.status]}
              </Badge>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Event</dt>
                <dd className="font-medium">{data.events?.name ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{data.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{data.email}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Keep this page bookmarked — you&apos;ll be notified when your
          registration is reviewed.
        </p>
      </div>
    </main>
  );
}
