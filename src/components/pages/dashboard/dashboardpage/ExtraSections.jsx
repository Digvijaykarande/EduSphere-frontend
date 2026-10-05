"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  BookOpen,
  Wallet,
  UserPlus,
  GraduationCap,
  Layers,
  Flame,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Hourglass,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PanelHeader,
  EmptyRow,
  usePagedItems,
  CardPagination,
} from "./SharedUI";
import { formatINRCompact } from "./helpers";

/* ---------------------------- GoalRing ---------------------------- */

const RING_TONES = {
  violet: "#6366F1",
  green: "#10B981",
  orange: "#F59E0B",
  blue: "#3B82F6",
  rose: "#F43F5E",
};

export function GoalRing({ label, pct, tone = "violet", sub, compareTo }) {
  const value = Math.max(0, Math.min(100, Number(pct) || 0));
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const toneColor = RING_TONES[tone] || RING_TONES.violet;

  const delta =
    compareTo != null ? Math.round((value - compareTo) * 10) / 10 : null;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            strokeWidth="8"
            className="stroke-slate-100 dark:stroke-slate-800"
          />
          {compareTo != null && (
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              strokeWidth="2"
              strokeDasharray="2 4"
              className="stroke-slate-400 dark:stroke-slate-400"
              style={{
                strokeDashoffset:
                  c - (Math.max(0, Math.min(100, compareTo)) / 100) * c,
              }}
            />
          )}
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={toneColor}
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono font-bold text-foreground">
            {value}%
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {label}
        </p>
        {sub ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {sub}
          </p>
        ) : null}
        {delta != null && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-full ${
              delta >= 0
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15"
                : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta}% vs {compareTo}% target
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- ActivityFeed ---------------------------- */

// `href` points each role's "View all" link at the page where that
// activity actually lives, since there's no dedicated activity-log route.
const FEED_THEME = {
  principal: {
    accent: "violet",
    title: "School activity",
    subtitle: "What's changed across the school",
    href: "/dashboard/events",
  },
  teacher: {
    accent: "blue",
    title: "Class activity",
    subtitle: "What's changed in your sections",
    href: "/dashboard/attendance",
  },
  student: {
    accent: "green",
    title: "My activity",
    subtitle: "Your recent updates",
    href: "/dashboard/academics",
  },
};

function buildActivityItems({ isStudent, isTeacher, data }) {
  const items = [];

  if (isStudent) {
    (data.homework || []).slice(0, 6).forEach((a) => {
      const status = a.submission?.status || "IN_PROGRESS";
      items.push({
        icon: BookOpen,
        tone:
          status === "GRADED"
            ? "green"
            : status === "SUBMITTED"
              ? "blue"
              : "orange",
        title:
          status === "GRADED"
            ? `Graded: ${a.title || a.subject || "Assignment"}`
            : status === "SUBMITTED"
              ? `Submitted: ${a.title || a.subject || "Assignment"}`
              : `New assignment: ${a.title || a.subject || "Assignment"}`,
        time: a.dueDate ? new Date(a.dueDate) : null,
      });
    });
    if (data.fee?.pendingAmount > 0) {
      items.push({
        icon: Wallet,
        tone: "orange",
        title: `Fee payment pending`,
        time: data.fee.dueDate ? new Date(data.fee.dueDate) : null,
      });
    }
  } else if (isTeacher) {
    (data.summaries || []).slice(0, 6).forEach((s) => {
      const marked = s.total > 0;
      items.push({
        icon: CheckCircle2,
        tone: marked ? "green" : "orange",
        title: marked
          ? `Attendance marked for ${s.classSection}`
          : `Attendance pending for ${s.classSection}`,
        time: null,
      });
    });
  } else {
    (data.events || []).slice(0, 6).forEach((e) => {
      items.push({
        icon: UserPlus,
        tone: "violet",
        title: e.title || "School event",
        time: e.date ? new Date(e.date) : null,
      });
    });
  }

  return items;
}

export function ActivityFeed({ isStudent, isTeacher, data }) {
  const items = buildActivityItems({ isStudent, isTeacher, data });
  const roleKey = isStudent ? "student" : isTeacher ? "teacher" : "principal";
  const theme = FEED_THEME[roleKey];

  const compact = roleKey === "student";
  const { page, pageCount, pageItems, next, prev } = usePagedItems(
    items,
    compact ? 4 : 4,
  );

  return (
    <Card className={`shadow-sm overflow-hidden ${compact ? "h-full" : ""}`}>
      <div
        className="h-1 w-full"
        style={{
          backgroundColor:
            RING_TONES[theme.accent === "green" ? "green" : theme.accent],
        }}
      />
      <CardHeader className={compact ? "pb-1.5 pt-4" : "pb-2"}>
        <PanelHeader
          title={theme.title}
          subtitle={theme.subtitle}
          href={theme.href}
          action="View all"
        />
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0 ? (
          <EmptyRow>Nothing new to show right now.</EmptyRow>
        ) : (
          <>
            <div
              className={`relative pl-4 ${compact ? "space-y-3" : "space-y-4"}`}
            >
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-100 dark:bg-slate-800" />
              {pageItems.map((it, i) => {
                const Icon = it.icon;
                return (
                  <motion.div
                    key={`${page}-${i}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative flex items-start gap-3"
                  >
                    <span
                      className={`absolute -left-4 mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900 ${
                        it.tone === "green"
                          ? "bg-emerald-500"
                          : it.tone === "orange"
                            ? "bg-amber-500"
                            : it.tone === "blue"
                              ? "bg-blue-500"
                              : "bg-violet-500"
                      }`}
                    />
                    <Icon
                      size={13}
                      className="mt-0.5 text-slate-300 dark:text-slate-600 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                        {it.title}
                      </p>
                      {it.time && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {it.time.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------------------- FocusPanel (role-scoped "at a glance" rings) ---------------------------- */

export function FocusPanel({
  isStudent,
  isTeacher,
  data = {},
  teacherDerived,
}) {
  if (isStudent) {
    const att = data?.attendance;
    const pct = att?.attendancePct ?? 0;
    const strong = pct >= 90;
    return (
      <Card className="report-card shadow-sm h-full" style={{ borderTop: "3px solid #10B981" }}>
        <CardHeader className="pb-2">
          <PanelHeader title="At a glance" subtitle="Your attendance, today" />
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <GoalRing
            label="Attendance"
            pct={pct}
            tone="green"
            sub={att ? `${att.present}/${att.total} periods` : "No data"}
            compareTo={90}
          />
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5">
            <Flame
              size={14}
              className={
                strong
                  ? "text-emerald-500"
                  : "text-slate-300 dark:text-slate-600"
              }
            />
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {strong
                ? "Above target — keep it up."
                : "Below the 90% target this term."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isTeacher) {
    const clsCount = teacherDerived?.classes ?? 0;
    const subjCount = teacherDerived?.subjects ?? 0;
    const prRate = teacherDerived?.presentRate;

    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2">
          <PanelHeader title="At a glance" subtitle="Today's marking status" />
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <GoalRing
            label="Today's marking"
            pct={prRate ?? 0}
            tone="violet"
            sub={
              prRate != null ? "Sections marked present rate" : "Not marked yet"
            }
            compareTo={100}
          />
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5">
            <Layers size={14} className="text-blue-500" />
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {clsCount} class{clsCount === 1 ? "" : "es"} · {subjCount} subject
              {subjCount === 1 ? "" : "s"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Principal
  const s = data?.schoolStats;
  const f = data?.feeStats;

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <PanelHeader title="At a glance" subtitle="Key ratios, today" />
      </CardHeader>
      <CardContent className="pt-0 space-y-5">
        <GoalRing
          label="Avg attendance"
          pct={s?.avgAttendancePct7d ?? 0}
          tone="green"
          sub="Last 7 days"
          compareTo={90}
        />
        <div className="h-px bg-slate-100 dark:bg-slate-800" />
        <GoalRing
          label="Fee collection"
          pct={f?.collectionRate ?? 0}
          tone="orange"
          sub="Of total billed"
          compareTo={100}
        />
        {/* <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5">
          <GraduationCap size={14} className="text-violet-500" />
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {s ? `${s.teachersMarkedToday}/${s.totalTeachers} teachers active today` : "No data"}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}

/* ---------------------------- NeedsAttention (Principal) ---------------------------- */
//
// Fills the slot next to ActivityFeed on the principal overview. Surfaces
// the two things a principal actually needs to act on today: sections
// with unmarked attendance, and students overdue on fees — both derived
// from data already fetched by useDashboardData (schoolStats/feeStats),
// no new API calls.

export function NeedsAttention({ data = {} }) {
  const s = data.schoolStats;
  const f = data.feeStats;

  const unmarkedTeachers = s
    ? Math.max(0, (s.totalTeachers || 0) - (s.teachersMarkedToday || 0))
    : null;
  const pendingStudents = f?.statusBreakdown?.Pending ?? null;
  const collectionRate = f?.collectionRate;

  const rows = [
    {
      icon: ClipboardCheck,
      tone: unmarkedTeachers > 0 ? "amber" : "green",
      title: "Attendance marking",
      value: s ? `${s.teachersMarkedToday}/${s.totalTeachers}` : "—",
      note: s
        ? unmarkedTeachers > 0
          ? `${unmarkedTeachers} teacher${unmarkedTeachers === 1 ? "" : "s"} yet to mark today`
          : "All teachers marked today"
        : "No data",
    },
    {
      icon: Wallet,
      tone: pendingStudents > 0 ? "amber" : "green",
      title: "Fee follow-ups",
      value: pendingStudents != null ? String(pendingStudents) : "—",
      note:
        pendingStudents != null
          ? `student${pendingStudents === 1 ? "" : "s"} with pending payments`
          : "No data",
    },
  ];

  return (
    <Card className="shadow-sm h-full overflow-hidden">
      <div
        className="h-1 w-full"
        style={{
          backgroundColor:
            unmarkedTeachers > 0 || pendingStudents > 0 ? "#F59E0B" : "#10B981",
        }}
      />
      <CardHeader className="pb-1">
        <PanelHeader title="Needs attention" subtitle="Today's open items" />
      </CardHeader>
      <CardContent className="pt-0 space-y-2.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3.5 py-3"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  r.tone === "amber"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {r.title}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {r.note}
                </p>
              </div>
              <span className="text-sm font-mono font-semibold text-foreground shrink-0">
                {r.value}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ---------------------------- FeeMiniCard (Student) ---------------------------- */
//
// Compact fee-status module for the student overview. Reuses data.fee,
// already fetched by useDashboardData — no new API calls. Sits alongside
// HomeworkProgress and the compacted ActivityFeed to fill out the row.

export function FeeMiniCard({ data = {} }) {
  const fee = data.fee;
  const pending = Number(fee?.pendingAmount || 0);
  const dueDate = fee?.dueDate ? new Date(fee.dueDate) : null;
  const overdue = dueDate ? dueDate.getTime() < Date.now() : false;
  const clear = fee && pending <= 0;

  return (
    <Card className="report-card shadow-sm h-full">
      <CardHeader className="pb-2">
        <PanelHeader
          title="My fees"
          subtitle="Current academic year"
          href="/dashboard/fees"
          action="Open"
        />
      </CardHeader>
      <CardContent className="pt-0">
        {!fee ? (
          <EmptyRow>No fee record found.</EmptyRow>
        ) : clear ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/10 px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                All fees paid
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Nothing pending this year
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-amber-100 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/10 px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Wallet size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-mono font-semibold text-amber-600 dark:text-amber-400">
                {formatINRCompact(pending)}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {overdue ? "Overdue" : "Pending"}
                {dueDate
                  ? ` · due ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : ""}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------------------- HomeworkProgress (Student) ---------------------------- */
//
// Fills the slot next to "My attendance mix" on the student overview.
// Breaks down the student's own homework list (already in `data.homework`)
// into graded / submitted / pending counts with a simple progress bar —
// distinct from the sidebar's pending-items list, which only lists titles.

export function HomeworkProgress({ data = {} }) {
  const hw = data.homework || [];
  const graded = hw.filter((a) => a.submission?.status === "GRADED").length;
  const submitted = hw.filter(
    (a) => a.submission?.status === "SUBMITTED",
  ).length;
  const pending = hw.length - graded - submitted;

  const total = hw.length || 1;
  const gradedPct = Math.round((graded / total) * 100);
  const submittedPct = Math.round((submitted / total) * 100);
  const pendingPct = 100 - gradedPct - submittedPct;

  const avgScore = (() => {
    const scored = hw.filter(
      (a) =>
        typeof a.submission?.score === "number" &&
        typeof a.submission?.maxScore === "number" &&
        a.submission.maxScore > 0,
    );
    if (!scored.length) return null;
    const pct =
      scored.reduce(
        (acc, a) => acc + a.submission.score / a.submission.maxScore,
        0,
      ) / scored.length;
    return Math.round(pct * 100);
  })();

  return (
    <Card className="report-card shadow-sm h-full">
      <CardHeader className="pb-2">
        <PanelHeader
          title="Homework progress"
          subtitle="Across all assigned work"
        />
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {hw.length === 0 ? (
          <EmptyRow>No homework assigned yet.</EmptyRow>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    strokeWidth="8"
                    className="stroke-slate-100 dark:stroke-slate-800"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="#10B981"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 34 * (1 - (graded + submitted) / total),
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-foreground">
                    {Math.round(((graded + submitted) / total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Completion rate
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {graded + submitted}/{hw.length} handed in
                </p>
                {avgScore != null && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold mt-1.5 px-1.5 py-0.5 rounded-full text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15">
                    <Star size={10} /> {avgScore}% avg score
                  </span>
                )}
              </div>
            </div>

            <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${gradedPct}%` }}
              />
              <div
                className="h-full bg-blue-500"
                style={{ width: `${submittedPct}%` }}
              />
              <div
                className="h-full bg-amber-500"
                style={{ width: `${pendingPct}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Graded",
                  val: graded,
                  color: "text-emerald-600 dark:text-emerald-400",
                  icon: CheckCircle2,
                },
                {
                  label: "Submitted",
                  val: submitted,
                  color: "text-blue-600 dark:text-blue-400",
                  icon: ClipboardCheck,
                },
                {
                  label: "Pending",
                  val: pending,
                  color: "text-amber-600 dark:text-amber-400",
                  icon: Hourglass,
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="text-center rounded-lg bg-slate-50/60 dark:bg-slate-800/40 py-2"
                  >
                    <Icon size={13} className={`mx-auto ${c.color}`} />
                    <p
                      className={`text-sm font-mono font-semibold mt-1 ${c.color}`}
                    >
                      {c.val}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {c.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
