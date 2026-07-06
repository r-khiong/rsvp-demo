"use client";

import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { SELECTED_ROW_BG } from "@/lib/status";
import type { Database } from "@/lib/supabase/types";
import { updateRegistrationsStatus } from "./actions";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];
type BatchAction = "approved" | "rejected";

export function RegistrationsTable({ rows }: { rows: Registration[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState<BatchAction | null>(null);
  const [isPending, startTransition] = useTransition();

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const headerState: boolean | "indeterminate" = allSelected
    ? true
    : selected.size > 0
      ? "indeterminate"
      : false;

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  }

  function runBatch(action: BatchAction) {
    const ids = [...selected];
    startTransition(async () => {
      try {
        const result = await updateRegistrationsStatus(ids, action);
        setConfirming(null);
        setSelected(new Set());
        const verb = action === "approved" ? "Approved" : "Rejected";
        const noun = result.updated === 1 ? "registration" : "registrations";
        const skipNote = result.skipped
          ? ` (${result.skipped} already ${action})`
          : "";
        toast.success(`${verb} ${result.updated} ${noun}${skipNote}`);
      } catch {
        toast.error("Update failed. Please try again.");
      }
    });
  }

  const selectedCount = selected.size;

  return (
    <div className="space-y-4">
      <div className="flex h-9 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedCount > 0
            ? `${selectedCount} selected`
            : `${rows.length} ${rows.length === 1 ? "registration" : "registrations"}`}
        </p>
        {selectedCount > 0 && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => setConfirming("rejected")}
            >
              Reject selected
            </Button>
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => setConfirming("approved")}
            >
              Approve selected
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={headerState}
                  onCheckedChange={toggleAll}
                  aria-label="Select all on this page"
                />
              </TableHead>
              <TableHead className="w-[15%]">Name</TableHead>
              <TableHead className="w-[22%]">Email</TableHead>
              <TableHead className="w-[12%]">Phone</TableHead>
              <TableHead className="w-[18%]">Company</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Status page</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? "selected" : undefined}
                  style={
                    isSelected ? { backgroundColor: SELECTED_ROW_BG } : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(row.id)}
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell className="truncate font-medium" title={row.name}>
                    {row.name}
                  </TableCell>
                  <TableCell className="truncate" title={row.email}>
                    {row.email}
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell
                    className="truncate"
                    title={row.company ?? undefined}
                  >
                    {row.company ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell
                    className="truncate text-muted-foreground"
                    title={row.remark ?? undefined}
                  >
                    {row.remark ?? "—"}
                  </TableCell>
                  <TableCell>
                    {row.status === "approved" && row.token && (
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <a
                          href={`/status/${encodeURIComponent(row.token)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open status page for ${row.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirming === "approved" ? "Approve" : "Reject"} {selectedCount}{" "}
              {selectedCount === 1 ? "applicant" : "applicants"}?
            </DialogTitle>
            <DialogDescription>
              {confirming === "approved"
                ? "Approved applicants can check in on-site."
                : "Rejected applicants will see an update on their status page."}{" "}
              This can be changed again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setConfirming(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => confirming && runBatch(confirming)}
            >
              {isPending
                ? "Saving..."
                : confirming === "approved"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
