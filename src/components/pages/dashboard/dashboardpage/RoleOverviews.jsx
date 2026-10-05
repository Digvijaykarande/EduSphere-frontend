// components/pages/dashboard/dashboardpage/RoleOverviews.jsx
//
// The three role-specific "main content" grids shown below the KPI cards:
// PrincipalOverview, TeacherOverview, StudentOverview.
//
// Redesign notes:
//  - Principal keeps a time-series chart (a trend of % over days is
//    inherently a line, not a same-day composition) but restyled on
//    Chart.js's "Point Styling" technique: each day's point is individually
//    shaped/colored/sized against a 90% target, so the shape itself reads
//    as signal before the tooltip does. See PrincipalTrendChart.jsx.
//  - Teacher/Student get the new Chart.js Polar Area "Radial Gradient"
//    chart (Present/Absent/Late composition) — see AttendanceChart.jsx.
//    Teacher's counts are summed across today's marked sections (no late
//    breakdown available at summary level, so Present/Absent only).
//    Student's counts come straight from their own attendance stats.
//  - The sidebar slot is content-aware via SmartSidePanel: a student
//    with a pending fee sees a fee-payment alert first; otherwise pending
//    homework; otherwise events. Teachers with unmarked sections see a
//    load/nudge card; otherwise events. Principals keep the events feed.
//  - ActivityFeed + FocusPanel are now genuinely role-differentiated
//    (accent color, copy, and ring composition change per role) rather
//    than the same generic panel reused with different props.

"use client";

import { Layers, BookOpen, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AttendanceChart from "./AttendanceChart";
import PrincipalTrendChart from "./PrincipalTrendChart";
import { PanelHeader, EmptyRow, FeeSnapshot, UpcomingEvents } from "./SharedUI";
import { SmartSidePanel } from "./SmartSidePanel";
import {
  ActivityFeed,
  FocusPanel,
  NeedsAttention,
  HomeworkProgress,
  FeeMiniCard,
} from "./ExtraSections";

/* ---------------------------- Principal ---------------------------- */

export function PrincipalOverview({ data, loading, teacherDerived }) {
  return (
    <>
      <Card className="p-5 pt-6 shadow-sm lg:col-span-2">
        <CardHeader className="p-0 pb-4">
          <PanelHeader
            title="Attendance trend"
            subtitle="School-wide daily attendance rate"
            href="/dashboard/attendance"
            action="Details"
          />
        </CardHeader>
        <CardContent className="p-0">
          <PrincipalTrendChart
            data={data.trend}
            dataKey="pct"
            dateKey="date"
            totalStudents={data.schoolStats?.totalStudents}
            loading={loading}
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <SmartSidePanel
          role="SCHOOL"
          isStudent={false}
          isTeacher={false}
          data={data}
        />
      </div>

      <div className="lg:col-span-1">
        <FocusPanel
          isStudent={false}
          isTeacher={false}
          data={data}
          teacherDerived={teacherDerived}
        />
      </div>

      <div className="lg:col-span-1">
        <ActivityFeed isStudent={false} isTeacher={false} data={data} />
      </div>

      <div className="lg:col-span-1">
        <NeedsAttention data={data} />
      </div>

      <Card className="p-5 pt-6 shadow-sm lg:col-span-2">
        <CardHeader className="p-0 pb-2">
          <PanelHeader
            title="Fee collection snapshot"
            subtitle="Current academic year"
            href="/dashboard/fees"
            action="Open fees"
          />
        </CardHeader>
        <CardContent className="p-0">
          <FeeSnapshot feeStats={data.feeStats} loading={loading} />
        </CardContent>
      </Card>
    </>
  );
}

/* ---------------------------- Teacher ---------------------------- */

export function TeacherOverview({ data, teacherDerived }) {
  const summaries = data.summaries || [];
  const todayPresent = summaries.reduce((acc, s) => acc + (s.present || 0), 0);
  const todayTotal = summaries.reduce((acc, s) => acc + (s.total || 0), 0);
  const todayAbsent = Math.max(0, todayTotal - todayPresent);
  const recentHomework = (data.createdHomework || []).slice(0, 4);

  return (
    <>
      <Card className="p-4 pt-4 shadow-sm lg:col-span-2">
        <CardHeader className="p-0 pb-3">
          <PanelHeader
            title="Today's attendance mix"
            subtitle="Present vs absent across your sections"
            href="/dashboard/attendance"
            action="Take attendance"
          />
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceChart
            present={todayPresent}
            absent={todayAbsent}
            late={0}
            week={data.summariesWeek}
          />
        </CardContent>
      </Card>

      <Card className="p-4 pt-4 shadow-sm lg:col-span-1">
        <CardHeader className="p-0 pb-3">
          <PanelHeader
            title="Today's classes"
            subtitle="Attendance status per section"
          />
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          {summaries.length === 0 && (
            <EmptyRow>No classes scheduled for today.</EmptyRow>
          )}

          {summaries.map((s, i) => {
            const pct = s.total ? Math.round((s.present / s.total) * 100) : 0;
            const marked = s.total > 0;

            return (
              <div
                key={s.sectionId || i}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5"
              >
                <span className="stat-icon-box stat-icon-violet !h-9 !w-9 !rounded-lg">
                  <Layers size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Class {s.classSection}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {s.subject}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-semibold text-foreground">
                    {marked ? `${s.present}/${s.total}` : "—"}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 mt-0.5 ${
                      !marked
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        : pct >= 90
                          ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : pct >= 75
                            ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            : "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {marked ? `${pct}% present` : "Not marked"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <SmartSidePanel
          role="TEACHER"
          isStudent={false}
          isTeacher={true}
          data={data}
        />
      </div>

      <div className="lg:col-span-1">
        <FocusPanel
          isStudent={false}
          isTeacher={true}
          data={data}
          teacherDerived={teacherDerived}
        />
      </div>

      <Card className="p-4 pt-4 shadow-sm lg:col-span-1">
        <CardHeader className="p-0 pb-3">
          <PanelHeader
            title="Recent homework posted"
            subtitle="Your latest assignments"
            href="/dashboard/academics"
            action="View all"
          />
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          {recentHomework.length === 0 && (
            <EmptyRow>You haven't posted any homework yet.</EmptyRow>
          )}

          {recentHomework.map((a, i) => {
            const due = a.dueDate ? new Date(a.dueDate) : null;
            return (
              <div
                key={a._id || a.slug || i}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5"
              >
                <span className="stat-icon-box stat-icon-orange !h-9 !w-9 !rounded-lg">
                  <FileText size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {a.title || a.subject || "Assignment"}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {a.subject ? `${a.subject} · ` : ""}
                    {due
                      ? `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : "No due date"}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ActivityFeed isStudent={false} isTeacher={true} data={data} />
      </div>

      <div className="lg:col-span-2">
        <UpcomingEvents events={data.events} />
      </div>
    </>
  );
}

/* ---------------------------- Student ---------------------------- */

export function StudentOverview({ data }) {
  const homework = data.homework || [];

  return (
    <>
      <Card className="report-card p-4 pt-5 shadow-sm lg:col-span-2">
        <CardHeader className="p-0 pb-3">
          <PanelHeader
            title="Pending homework"
            subtitle="Assignments awaiting your submission"
            href="/dashboard/academics"
            action="Open"
          />
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          {homework.length === 0 && (
            <EmptyRow>No homework assigned yet.</EmptyRow>
          )}

          {homework.slice(0, 6).map((a, i) => {
            const status = a.submission?.status || "IN_PROGRESS";
            const due = a.dueDate ? new Date(a.dueDate) : null;

            return (
              <div
                key={a._id || a.slug || i}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3.5 py-3"
              >
                <span className="stat-icon-box stat-icon-blue !h-9 !w-9 !rounded-lg">
                  <BookOpen size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {a.title || a.subject || "Assignment"}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {a.subject ? `${a.subject} · ` : ""}
                    {due
                      ? `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : "No due date"}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-[10px] px-2 py-0.5 ${
                    status === "GRADED"
                      ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : status === "SUBMITTED"
                        ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300"
                        : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {status === "IN_PROGRESS" ? "PENDING" : status}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <SmartSidePanel
          role="STUDENT"
          isStudent={true}
          isTeacher={false}
          data={data}
        />
      </div>

      <Card className="report-card p-4 pt-5 shadow-sm lg:col-span-1">
        <CardHeader className="p-0 ">
          <PanelHeader
            title="My attendance mix"
            subtitle="Present / absent / late"
            href="/dashboard/attendance"
            action="Details"
          />
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceChart
            present={data.attendance?.present || 0}
            absent={data.attendance?.absent || 0}
            late={data.attendance?.late || 0}
            week={data.attendanceWeek}
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <FocusPanel isStudent={true} isTeacher={false} data={data} />
      </div>

      <div className="lg:col-span-1">
        <HomeworkProgress data={data} />
      </div>

      <div className="lg:col-span-1">
        <FeeMiniCard data={data} />
      </div>

      <div className="lg:col-span-1">
        <ActivityFeed isStudent={true} isTeacher={false} data={data} />
      </div>
    </>
  );
}
