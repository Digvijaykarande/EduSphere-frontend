"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

// -----------------------------------------------------------------------
// Two StatCard visual variants existed side by side (dashboard overview vs
// fees module). Both are preserved exactly, selected via `variant`, so no
// page's appearance changes — this only removes the duplicated component
// definitions.
// -----------------------------------------------------------------------

const RAIL_TONES = {
  violet: "#6366F1",
  green: "#10B981",
  orange: "#F59E0B",
  blue: "#3B82F6",
};

// "rail" variant — left accent border on a .report-card, used on the main
// dashboard overview (previously SharedUI.jsx StatCard).
function RailStatCard({ label, value, sub, icon: Icon, tone = "violet" }) {
  const accent = RAIL_TONES[tone] || RAIL_TONES.violet;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{ borderLeft: `3px solid ${accent}` }}
      className="report-card !border-t-0 p-5 pt-5 pl-4 shadow-sm hover:shadow-md transition-all duration-200 rounded-l-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <h3 className="text-2xl font-mono font-semibold text-foreground mt-2 truncate">
            {value}
          </h3>
          {sub ? (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mt-1.5 truncate">
              {sub}
            </span>
          ) : null}
        </div>
        {Icon ? (
          <div className={`stat-icon-box stat-icon-${tone}`}>
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

const CARD_TONES = {
  violet: {
    bar: "bg-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconText: "text-violet-600 dark:text-violet-400",
  },
  blue: {
    bar: "bg-indigo-500",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    iconText: "text-indigo-600 dark:text-indigo-400",
  },
  green: {
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconText: "text-amber-600 dark:text-amber-400",
  },
};

// "bar" variant — top-left vertical accent bar on a plain Card, used on the
// fees dashboard (previously fees/shared.jsx StatCard).
function BarStatCard({ label, value, change, icon: Icon, tone = "violet" }) {
  const t = CARD_TONES[tone] || CARD_TONES.violet;

  return (
    <Card className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 shadow-sm">
      <span className={`absolute left-0 top-0 h-full w-1 ${t.bar}`} />
      <div className="flex items-start gap-3 py-4 pl-5 pr-4">
        {Icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.iconBg} ${t.iconText}`}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-2xl font-bold leading-none tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          {change ? (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 truncate">
              {change}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function StatCard({ variant = "rail", ...props }) {
  return variant === "bar" ? <BarStatCard {...props} /> : <RailStatCard {...props} />;
}

export default StatCard;
