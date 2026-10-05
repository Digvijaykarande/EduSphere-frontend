"use client";

import { Badge } from "@/components/ui/badge";

// Generic colored status pill. Ships with the fee-status palette used
// previously (fees/shared.jsx StatusBadge) as the default `tones`, but any
// module can pass its own status->class map so wording/colors stay exact
// per module while the rendering logic is shared.
const DEFAULT_TONES = {
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  "Partial Paid":
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Pending: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

export function StatusBadge({ status, tones = DEFAULT_TONES, fallbackTone }) {
  const toneClass =
    tones[status] || fallbackTone || tones.Pending || Object.values(tones)[0];

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${toneClass}`}
    >
      {status}
    </Badge>
  );
}

export default StatusBadge;
