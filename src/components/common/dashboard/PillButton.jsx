"use client";

import { cn } from "@/lib/utils";

// Thin wrapper around the existing .btn-pill-primary / .btn-pill-outline
// global classes so every module's "Create X" / "Export Y" button is built
// the same way. Does not introduce new styling — just centralizes the
// className strings that were previously copy-pasted per module.
export function PillButton({
  icon: Icon,
  iconSize = 15,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base =
    variant === "outline"
      ? "btn-pill-outline dark:!border-slate-700 dark:!text-slate-300 dark:bg-slate-800"
      : "btn-pill-primary";

  return (
    <button
      className={cn(
        base,
        "!px-5 !py-2.5 text-xs gap-2 cursor-pointer",
        className
      )}
      {...props}
    >
      {Icon ? <Icon size={iconSize} /> : null}
      {children}
    </button>
  );
}

export default PillButton;
