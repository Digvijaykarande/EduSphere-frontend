// components/pages/dashboard/dashboardpage/SmartSidePanel.jsx
//
// Context-aware sidebar slot, now genuinely different per role instead of
// falling back to the same UpcomingEvents card for everyone:
//   - Student, fees pending  -> FeeAlertCard (priority: money owed)
//   - Student, fees clear    -> pending-homework mini list, else events
//   - Teacher                -> TeacherLoadCard (today's section load +
//                                unmarked-attendance nudge) if there's
//                                anything unmarked, else events
//   - Principal               -> UpcomingEvents (unchanged — events are
//                                genuinely the most useful sidebar content
//                                at that scope)

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Layers,
  AlarmClock,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpcomingEvents, EmptyRow } from "./SharedUI";
import { formatINRCompact } from "./helpers";

/* ---------------------------- FeeAlertCard ---------------------------- */

function FeeAlertCard({ fee }) {
  const pending = Number(fee?.pendingAmount || 0);
  const dueDate = fee?.dueDate ? new Date(fee.dueDate) : null;
  const overdue = dueDate ? dueDate.getTime() < Date.now() : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden border-amber-200/70 dark:border-amber-500/25 bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 shadow-sm">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Wallet size={17} />
              </span>
              <div>
                <h3 className="text-sm font-display font-semibold text-foreground">Fee payment due</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {fee?.status || "Payment pending"}
                </p>
              </div>
            </div>
            {overdue ? (
              <Badge variant="destructive" className="gap-1 text-[10px]">
                <AlertTriangle size={10} /> Overdue
              </Badge>
            ) : (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 text-[10px]">
                Pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-white/70 dark:bg-slate-900/50 px-4 py-3.5 mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Amount pending
            </p>
            <p className="text-2xl font-mono font-semibold text-amber-600 dark:text-amber-400 mt-1">
              {formatINRCompact(pending)}
            </p>
            {dueDate && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-flex items-center gap-1">
                <CalendarClock size={11} />
                {overdue ? "Was due" : "Due"} {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
          <Button asChild size="sm" className="w-full gap-1.5">
            <Link href="/dashboard/fees">
              Pay now <ArrowRight size={13} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------------------------- PendingHomeworkMini ---------------------------- */

function PendingHomeworkMini({ homework = [] }) {
  const pending = homework
    .filter((a) => (a.submission?.status || "IN_PROGRESS") === "IN_PROGRESS")
    .slice(0, 4);

  return (
    <Card className="report-card shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground">Homework due</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Assignments awaiting submission
            </p>
          </div>
          <Link
            href="/dashboard/academics"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-1.5 transition-all"
          >
            View <ArrowRight size={13} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {pending.length === 0 && <EmptyRow>You're all caught up — nothing pending.</EmptyRow>}
        {pending.map((a, i) => {
          const due = a.dueDate ? new Date(a.dueDate) : null;
          return (
            <motion.div
              key={a._id || a.slug || i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5"
            >
              <span className="stat-icon-box stat-icon-blue !h-8 !w-8 !rounded-lg shrink-0">
                <BookOpen size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {a.title || a.subject || "Assignment"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {due ? `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "No due date"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ---------------------------- TeacherLoadCard ---------------------------- */

function TeacherLoadCard({ summaries = [] }) {
  const unmarked = summaries.filter((s) => !s.total || s.total === 0);
  const marked = summaries.length - unmarked.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        className={`relative overflow-hidden shadow-sm ${
          unmarked.length > 0
            ? "border-blue-200/70 dark:border-blue-500/25 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900"
            : ""
        }`}
      >
        {unmarked.length > 0 && (
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Layers size={17} />
            </span>
            <div>
              <h3 className="text-sm font-display font-semibold text-foreground">Today's sections</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {marked}/{summaries.length} marked
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {summaries.length === 0 ? (
            <EmptyRow>No classes scheduled for today.</EmptyRow>
          ) : unmarked.length > 0 ? (
            <>
              <div className="rounded-xl border border-blue-200/60 dark:border-blue-500/20 bg-white/70 dark:bg-slate-900/50 px-4 py-3.5 mb-3">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
                  <AlarmClock size={13} className="text-blue-500" />
                  {unmarked.length} section{unmarked.length === 1 ? "" : "s"} still need attendance
                </p>
              </div>
              <Button asChild size="sm" className="w-full gap-1.5">
                <Link href="/dashboard/attendance">
                  Take attendance <ArrowRight size={13} />
                </Link>
              </Button>
            </>
          ) : (
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 py-1">
              All sections marked for today.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------------------------- SmartSidePanel (export) ---------------------------- */

export function SmartSidePanel({ role, isStudent, isTeacher, data }) {
  if (isStudent) {
    const fee = data.fee;
    const feePending = fee && Number(fee.pendingAmount) > 0;

    if (feePending) return <FeeAlertCard fee={fee} />;

    const hasPendingHw = (data.homework || []).some(
      (a) => (a.submission?.status || "IN_PROGRESS") === "IN_PROGRESS",
    );
    if (hasPendingHw) return <PendingHomeworkMini homework={data.homework} />;

    return <UpcomingEvents events={data.events} />;
  }

  if (isTeacher) {
    const summaries = data.summaries || [];
    if (summaries.length > 0) return <TeacherLoadCard summaries={summaries} />;
    return <UpcomingEvents events={data.events} />;
  }

  return <UpcomingEvents events={data.events} />;
}
