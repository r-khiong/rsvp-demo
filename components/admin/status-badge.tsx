import type { RegistrationStatus } from "@/lib/supabase/types";
import { STATUS_STYLES } from "@/lib/status";

export function StatusBadge({ status }: { status: RegistrationStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}
