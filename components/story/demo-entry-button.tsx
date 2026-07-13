"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signInAsDemo } from "@/app/admin/login/actions";

// Story-page CTA into the read-only admin demo (RSVP-8). Same failure-branch
// pattern as the login page: on success the server action redirects, so this
// component only ever renders the error state.
export function DemoEntryButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await signInAsDemo();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? "Entering demo..." : "Enter admin demo (read-only)"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
