// components/pages/dashboard/dashboardpage/useDashboardData.js
//
// Owns all dashboard KPI data fetching per role. Real API calls only.

"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { todayISO } from "./helpers";

const pick = (r) => (r.status === "fulfilled" ? r.value : null);

export function useDashboardData(role, isStudent, isTeacher) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    if (!role) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const todayStr = todayISO();

      try {
        if (isStudent) {
          const [att, fee, hw, ev, attWeek] = await Promise.allSettled([
            api.getMyAttendance({}),
            api.getMyFee({}),
            api.getMyVisibleAssignments(),
            api.getEvents({ from: todayStr }),
            // Not live on the backend yet - resolves to null until the
            // /api/attendance/mine/week route exists; UI falls back to
            // today-only when this is empty.
            api.getMyAttendanceWeek({}),
          ]);
          if (cancelled) return;
          setData({
            attendance: pick(att)?.data?.stats || null,
            fee: pick(fee)?.data?.fee || null,
            homework: pick(hw)?.data?.assignments || [],
            events: pick(ev)?.data || [],
            attendanceWeek: pick(attWeek)?.data?.week || [],
          });
        } else if (isTeacher) {
          const [asg, sum, created, ev, sumWeek] = await Promise.allSettled([
            api.getMyAssignments(),
            api.getMyTodaySummaries(),
            api.getMyCreatedAssignments(),
            api.getEvents({ from: todayStr }),
            // Not live on the backend yet - resolves to null until the
            // /api/attendance/today-summaries/week route exists; UI falls
            // back to today-only when this is empty.
            api.getMyWeeklySummaries({}),
          ]);
          if (cancelled) return;
          setData({
            assignments: pick(asg)?.data?.assignments || [],
            summaries: pick(sum)?.data?.summaries || [],
            createdHomework: pick(created)?.data?.assignments || [],
            events: pick(ev)?.data || [],
            summariesWeek: pick(sumWeek)?.data?.week || [],
          });
        } else {
          const [stats, fee, trend, ev] = await Promise.allSettled([
            api.getSchoolStats(),
            api.getSchoolFeeStats({}),
            api.getSchoolAttendanceTrend({}),
            api.getEvents({ from: todayStr }),
          ]);
          if (cancelled) return;
          setData({
            schoolStats: pick(stats)?.data || null,
            feeStats: pick(fee)?.data?.stats || null,
            trend: pick(trend)?.data?.trend || [],
            events: pick(ev)?.data || [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role, isStudent, isTeacher]);

  const teacherDerived = useMemo(() => {
    const assignments = data.assignments || [];
    const summaries = data.summaries || [];
    const sectionIds = new Set();
    const subjects = new Set();

    for (const a of assignments) {
      if (a.sectionId?._id) sectionIds.add(String(a.sectionId._id));
      (a.subjects || []).forEach((s) => subjects.add(s));
    }

    const totalToday = summaries.reduce((acc, s) => acc + (s.total || 0), 0);
    const presentToday = summaries.reduce((acc, s) => acc + (s.present || 0), 0);
    const rate = totalToday ? Math.round((presentToday / totalToday) * 100) : null;

    return {
      classes: sectionIds.size,
      subjects: subjects.size,
      homework: (data.createdHomework || []).length,
      presentRate: rate,
    };
  }, [data.assignments, data.summaries, data.createdHomework]);

  const studentDerived = useMemo(() => {
    const hw = data.homework || [];
    const pending = hw.filter(
      (a) => (a.submission?.status || "IN_PROGRESS") === "IN_PROGRESS",
    ).length;
    return { pendingHw: pending };
  }, [data.homework]);

  return { loading, data, teacherDerived, studentDerived };
}
