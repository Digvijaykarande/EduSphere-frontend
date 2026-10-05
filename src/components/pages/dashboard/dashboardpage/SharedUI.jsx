// components/pages/dashboard/dashboardpage/sharedUI.jsx

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Building2,
} from "lucide-react";
import {
  itemVariants,
  containerVariants,
  formatINRCompact,
  ROLE_LABEL,
  greeting,
  todayLabel,
} from "./helpers";
import { usePagedItems, CardPagination } from "@/components/common/dashboard/Pagination";
import { StatCard as CommonStatCard } from "@/components/common/dashboard/StatCard";
import { PanelHeader as CommonPanelHeader } from "@/components/common/dashboard/PanelHeader";

/* ---------------------------- pagination utilities ---------------------------- */
// Re-exported from the shared common module so existing imports of
// usePagedItems / CardPagination from this file keep working unchanged.
export { usePagedItems, CardPagination };

/* ---------------------------- StatCard ---------------------------- */
// "rail" variant of the shared StatCard — identical accent-rail styling.
export function StatCard({ label, value, sub, icon, tone = "violet" }) {
  return (
    <CommonStatCard
      variant="rail"
      label={label}
      value={value}
      sub={sub}
      icon={icon}
      tone={tone}
    />
  );
}

/* ---------------------------- PanelHeader ---------------------------- */
export function PanelHeader({ title, subtitle, href, action }) {
  return (
    <CommonPanelHeader
      title={title}
      subtitle={subtitle}
      href={href}
      action={action}
    />
  );
}

/* ---------------------------- QuickAction / QuickActionsBar ---------------------------- */

export function QuickAction({ href, label, icon: Icon, tone = "violet" }) {
  return (
    <Link href={href} className="group">
      <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 hover:border-primary/50 hover:shadow-sm transition-all">
        <span
          className={`stat-icon-box stat-icon-${tone} !h-8 !w-8 !rounded-lg`}
        >
          <Icon size={15} />
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
          {label}
        </span>
        <ArrowUpRight
          size={13}
          className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors"
        />
      </div>
    </Link>
  );
}

export function QuickActionsBar({ actions }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {actions.map((a) => (
        <QuickAction key={a.href + a.label} {...a} />
      ))}
    </div>
  );
}

/* ---------------------------- EmptyRow ---------------------------- */

export function EmptyRow({ children }) {
  return (
    <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
      {children}
    </p>
  );
}

/* ---------------------------- UpcomingEvents ---------------------------- */

export function UpcomingEvents({ events, compact = false }) {
  const list = events || [];
  const { page, pageCount, pageItems, next, prev } = usePagedItems(
    list,
    compact ? 4 : 4,
  );

  return (
    <div
      className="report-card p-5 pt-6 shadow-sm"
      style={{ borderTop: "3px solid #6366F1" }}
    >
      <PanelHeader
        title="Upcoming events"
        subtitle="Next dates on the school calendar"
        href="/dashboard/events"
      />
      <div className="space-y-2.5 min-h-[1px]">
        {list.length === 0 && (
          <EmptyRow>No upcoming events scheduled.</EmptyRow>
        )}
        {pageItems.map((e, i) => {
          const d = e.date ? new Date(e.date) : null;
          return (
            <motion.div
              key={e._id || i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5"
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] font-bold uppercase text-primary leading-none">
                  {d ? d.toLocaleDateString("en-US", { month: "short" }) : "—"}
                </span>
                <span className="text-sm font-mono font-bold text-foreground leading-tight">
                  {d ? d.getDate() : "?"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {e.title || "Untitled event"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                  {e.category ? (
                    <span className="badge-tone badge-event">{e.category}</span>
                  ) : null}
                  {e.start ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={10} /> {e.start}
                    </span>
                  ) : null}
                  {e.location ? (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin size={10} /> {e.location}
                    </span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <CardPagination
        page={page}
        pageCount={pageCount}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}

/* ---------------------------- FeeSnapshot ---------------------------- */

export function FeeSnapshot({ feeStats, loading }) {
  if (loading)
    return (
      <div className="h-24 animate-pulse bg-slate-50 dark:bg-slate-800/40 rounded-xl" />
    );

  if (!feeStats)
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400 py-4 justify-center">
        <AlertCircle size={14} /> Fee data unavailable.
      </div>
    );

  const cells = [
    {
      label: "Collected",
      value: formatINRCompact(feeStats.totalCollected),
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending",
      value: formatINRCompact(feeStats.totalPending),
      tone: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Collection rate",
      value: `${feeStats.collectionRate}%`,
      tone: "text-primary",
    },
    {
      label: "Fully paid",
      value: `${feeStats.statusBreakdown?.Paid ?? 0}`,
      tone: "text-slate-700 dark:text-slate-200",
    },
    {
      label: "Pending students",
      value: `${feeStats.statusBreakdown?.Pending ?? 0}`,
      tone: "text-slate-700 dark:text-slate-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {c.label}
          </p>
          <p className={`text-lg font-mono font-semibold mt-1 ${c.tone}`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- DashboardHeader ---------------------------- */

export function DashboardHeader({ role, displayName, schoolName }) {
  const hour = new Date().getHours();

  // Dynamic greeting configuration
  const timeConfig =
    hour < 12
      ? {
          text: "Good morning",
          icon: Sun,
          tone: "text-amber-500 bg-amber-500/10",
        }
      : hour < 17
        ? {
            text: "Good afternoon",
            icon: Sunset,
            tone: "text-orange-500 bg-orange-500/10",
          }
        : {
            text: "Good evening",
            icon: Moon,
            tone: "text-indigo-400 bg-indigo-500/10",
          };

  const TimeIcon = timeConfig.icon;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-1">
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${timeConfig.tone}`}
          >
            <TimeIcon size={14} />
            {timeConfig.text}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Sparkles size={12} className="text-primary" />
            {ROLE_LABEL[role] || "Member"}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight truncate">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            {displayName}
          </span>{" "}
          <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-medium">
            <Building2 size={13} className="text-slate-400" />
            {schoolName}
          </span>
          <span>•</span>
          <span className="font-mono">{todayLabel()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 bg-card px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 shadow-sm self-start md:self-auto shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>All systems operational</span>
      </div>
    </div>
  );
}

/* ---------------------------- StatsGrid ---------------------------- */

export function StatsGrid({ loading, stats }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="report-card p-5 pt-6 h-[116px] animate-pulse"
            style={{ borderTop: "3px solid #6366F1" }}
          >
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded mt-3" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded mt-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </motion.div>
  );
}
