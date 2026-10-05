"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  CalendarDays,
  CalendarClock,
  BookOpen,
  NotebookPen,
  FlaskConical,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TYPE_STYLES = {
  class: {
    icon: BookOpen,
    dot: "bg-primary",
    bar: "bg-primary",
    chip: "bg-primary/10 text-primary",
    iconBox: "bg-primary/10 text-primary",
    label: "Class",
    calendarBox:
      "bg-primary/[0.06] border-primary/20 hover:bg-primary/10 hover:border-primary/30",
    calendarText: "text-primary",
    ring: "ring-primary/15",
  },
  planning: {
    icon: NotebookPen,
    dot: "bg-success",
    bar: "bg-success",
    chip: "bg-success/10 text-success",
    iconBox: "bg-success/10 text-success",
    label: "Planning",
    calendarBox:
      "bg-success/[0.06] border-success/20 hover:bg-success/10 hover:border-success/30",
    calendarText: "text-success",
    ring: "ring-success/15",
  },
  lab: {
    icon: FlaskConical,
    dot: "bg-blue-500",
    bar: "bg-blue-500",
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    iconBox: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Lab session",
    calendarBox:
      "bg-blue-500/[0.06] border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30",
    calendarText: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/15",
  },
};

const DAYS_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VISIBLE_ROWS = 4;

function todayAbbrev() {
  const jsDay = new Date().getDay();
  const mondayFirst = jsDay === 0 ? 6 : jsDay - 1;
  return DAYS_ORDER[mondayFirst];
}

function parseTimeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (period.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function useCurrentPeriodId(scheduleItems) {
  return useMemo(() => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    for (const item of scheduleItems) {
      const start = parseTimeToMinutes(item.time);
      if (start === null) continue;
      const end = start + (item.durationMinutes || 0);
      if (nowMinutes >= start && nowMinutes < end) return item.id;
    }
    return null;
  }, [scheduleItems]);
}

/* ---------- Empty / status states ---------- */

function StateMessage({ icon: Icon, title, subtitle, tone = "default" }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
      <span
        className={`flex items-center justify-center w-12 h-12 rounded-2xl ${
          tone === "danger"
            ? "bg-rose-500/10 text-rose-500"
            : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"
        }`}
      >
        <Icon className="w-6 h-6" />
      </span>
      <div>
        <p
          className={`text-sm font-bold ${tone === "danger" ? "text-rose-500" : "text-foreground"}`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5 max-w-[240px]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Day timeline ---------- */

function ScheduleRow({ item, isNow, isLast }) {
  const style = TYPE_STYLES[item.type] || TYPE_STYLES.class;
  const Icon = style.icon;

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* time column */}
      <div className="w-14 sm:w-16 shrink-0 pt-3.5 text-right">
        <span className="text-xs font-bold text-foreground tabular-nums">{item.time}</span>
      </div>

      {/* line + dot */}
      <div className="relative flex flex-col items-center">
        <span
          className={`mt-4 w-2.5 h-2.5 rounded-full shrink-0 ${
            isNow ? `${style.dot} animate-pulse ring-4 ${style.ring}` : "bg-slate-300 dark:bg-slate-700"
          }`}
        />
        {!isLast && (
          <span className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-1" />
        )}
      </div>

      {/* card */}
      <div className="flex-1 min-w-0 pb-4">
        <div
          className={`rounded-2xl border p-3.5 flex items-center gap-3 transition-colors ${
            isNow
              ? "border-primary/40 bg-primary/[0.05]"
              : "border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
          }`}
        >
          <span
            className={`hidden xs:flex sm:flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${style.iconBox}`}
          >
            <Icon className="w-4.5 h-4.5" />
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {item.classBadge && (
                <Badge className="bg-primary text-white hover:bg-primary text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 h-4.5">
                  {item.classBadge}
                </Badge>
              )}
              <Badge
                variant="secondary"
                className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 h-4.5 ${style.chip}`}
              >
                {style.label}
              </Badge>
              {isNow && (
                <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Live now
                </span>
              )}
            </div>
            <h4 className="font-bold text-foreground text-sm truncate">{item.title}</h4>
            {item.topic && (
              <p className="text-xs text-slate-500 font-medium truncate">{item.topic}</p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{item.durationMinutes} mins</span>
            <span className="sm:hidden">{item.durationMinutes}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayTimeline({ scheduleItems }) {
  const currentId = useCurrentPeriodId(scheduleItems);
  const needsScroll = scheduleItems.length > VISIBLE_ROWS;

  if (scheduleItems.length === 0) {
    return (
      <StateMessage
        icon={CalendarDays}
        title="No periods today"
        subtitle="Nothing is scheduled for you today — enjoy the breather."
      />
    );
  }

  return (
    <div
      className={needsScroll ? "overflow-y-auto pr-1 -mr-1" : ""}
      style={needsScroll ? { maxHeight: 400 } : undefined}
    >
      {scheduleItems.map((item, i) => (
        <ScheduleRow
          key={item.id}
          item={item}
          isNow={item.id === currentId}
          isLast={i === scheduleItems.length - 1}
        />
      ))}
    </div>
  );
}

/* ---------- Week grid ---------- */

const WEEK_ROW_HEIGHT = 84;
const WEEK_VISIBLE_ROWS = 4;

function WeekSlotCard({ slot }) {
  if (!slot) {
    return (
      <div className="h-full w-full rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
        <span className="text-[10px] font-medium text-slate-300 dark:text-slate-700">Free</span>
      </div>
    );
  }
  const style = TYPE_STYLES[slot.type] || TYPE_STYLES.class;
  const Icon = style.icon;
  return (
    <div
      className={`h-full w-full rounded-lg border p-2 flex flex-col justify-center gap-1 transition-colors ${style.calendarBox}`}
    >
      <span className={`flex items-center justify-center w-5 h-5 rounded-md ${style.iconBox}`}>
        <Icon className="w-3 h-3" />
      </span>
      <span className={`text-[11px] font-bold leading-tight line-clamp-2 ${style.calendarText}`}>
        {slot.subject}
      </span>
      {slot.classBadge && (
        <span className="text-[10px] font-semibold tracking-wide truncate text-slate-500 dark:text-slate-400">
          {slot.classBadge}
        </span>
      )}
    </div>
  );
}

function WeekGridMobile({ days, periods, todayIndex }) {
  const [activeDay, setActiveDay] = useState(days[todayIndex] ?? days[0]);
  const rows = periods
    .map((period) => ({ period, slot: period[activeDay] }))
    .filter((r) => r.slot);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
      <div className="flex gap-1.5 p-2.5 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {days.map((day, i) => (
          <Button
            key={day}
            type="button"
            size="sm"
            variant={activeDay === day ? "default" : "ghost"}
            onClick={() => setActiveDay(day)}
            className={`shrink-0 h-8 px-3.5 text-xs font-bold rounded-lg ${
              i === todayIndex && activeDay !== day ? "text-primary" : ""
            }`}
          >
            {day}
            {i === todayIndex && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            )}
          </Button>
        ))}
      </div>

      <div className="p-3 space-y-2">
        {rows.length === 0 ? (
          <StateMessage
            icon={CalendarDays}
            title={`Nothing scheduled`}
            subtitle={`${activeDay} is free — no periods on the board.`}
          />
        ) : (
          rows.map(({ period, slot }) => {
            const style = TYPE_STYLES[slot.type] || TYPE_STYLES.class;
            const Icon = style.icon;
            return (
              <div
                key={period.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${style.calendarBox}`}
              >
                <div className="w-14 shrink-0 text-[11px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                  {period.time}
                </div>
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${style.iconBox}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold truncate ${style.calendarText}`}>{slot.subject}</p>
                  {slot.classBadge && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {slot.classBadge}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function WeekGridDesktop({ days, periods, todayIndex }) {
  const needsScroll = periods.length > WEEK_VISIBLE_ROWS;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[760px]">
          <div
            className="grid bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 "
            style={{
              gridTemplateColumns: `85px repeat(${days.length}, minmax(110px, 1fr))`,
            }}
          >
            <div className="p-3 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-slate-900/50" />
            {days.map((day, i) => {
              const isToday = i === todayIndex;
              return (
                <div
                  key={day}
                  className={`p-3 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${isToday ? "bg-primary/[0.06]" : ""}`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider ${isToday ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {day}
                    {isToday && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className={`custom-scrollbar ${needsScroll ? "overflow-y-auto" : ""}`}
            style={needsScroll ? { maxHeight: WEEK_ROW_HEIGHT * WEEK_VISIBLE_ROWS } : undefined}
          >
            {periods.map((period) => (
              <div
                key={period.id}
                className="grid border-b border-slate-200 dark:border-slate-800 last:border-b-0 group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                style={{
                  gridTemplateColumns: `85px repeat(${days.length}, minmax(110px, 1fr))`,
                }}
              >
                <div className="p-2 flex flex-col justify-center items-center text-center border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-950 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50 transition-colors z-10">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    {period.time}
                  </span>
                </div>

                {days.map((day, colIdx) => (
                  <div
                    key={`${period.id}-${day}`}
                    className={`p-1.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${colIdx === todayIndex ? "bg-primary/[0.02]" : ""}`}
                    style={{ height: WEEK_ROW_HEIGHT }}
                  >
                    <WeekSlotCard slot={period[day]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {needsScroll && (
        <p className="text-center text-[11px] font-semibold text-slate-500 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          Scroll to see more periods
        </p>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 6px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}

function WeekGrid({ weekSchedule }) {
  const { days, periods } = weekSchedule;
  const todayIndex = useMemo(() => days.indexOf(todayAbbrev()), [days]);

  if (periods.length === 0) {
    return (
      <StateMessage
        icon={CalendarDays}
        title="No weekly slots yet"
        subtitle="Once your timetable is set, it'll show up here."
      />
    );
  }

  return (
    <>
      <div className="sm:hidden">
        <WeekGridMobile days={days} periods={periods} todayIndex={todayIndex} />
      </div>
      <div className="hidden sm:block">
        <WeekGridDesktop days={days} periods={periods} todayIndex={todayIndex} />
      </div>
    </>
  );
}

/* ---------- Root component ---------- */

export default function TeacherSchedule() {
  const [viewMode, setViewMode] = useState("day");
  const [schedule, setSchedule] = useState({
    today: [],
    week: { days: [], periods: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getMyTeacherSchedule()
      .then((res) => {
        if (!cancelled)
          setSchedule(res.data || { today: [], week: { days: [], periods: [] } });
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "Failed to load schedule.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-0" style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="stat-icon-box stat-icon-violet">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                Daily & Weekly Schedule
              </h3>
              <p className="text-xs text-slate-400">Your teaching timetable & prep sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex items-center border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-4 w-full sm:w-auto">
          <Button
            type="button"
            size="sm"
            variant={viewMode === "day" ? "secondary" : "ghost"}
            onClick={() => setViewMode("day")}
            className={`flex-1 sm:flex-none h-8 rounded-lg gap-1.5 ${viewMode === "day" ? "bg-white dark:bg-slate-900 text-primary font-bold shadow-sm" : "hover:text-foreground"}`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            Day
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === "week" ? "secondary" : "ghost"}
            onClick={() => setViewMode("week")}
            className={`flex-1 sm:flex-none h-8 rounded-lg gap-1.5 ${viewMode === "week" ? "bg-white dark:bg-slate-900 text-primary font-bold shadow-sm" : "hover:text-foreground"}`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Week
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading your schedule…
          </div>
        ) : error ? (
          <StateMessage icon={CalendarClock} title={error} tone="danger" />
        ) : viewMode === "day" ? (
          <DayTimeline scheduleItems={schedule.today} />
        ) : (
          <WeekGrid weekSchedule={schedule.week} />
        )}
      </CardContent>
    </Card>
  );
}
