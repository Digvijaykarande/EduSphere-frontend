// components/pages/dashboard/attendance/components/AttendanceChart.jsx
//
// Present vs Absent chart, Monday - Saturday.
//
// Data contract:
//   <AttendanceChart present={12} absent={3} />
//     -> only "today's" real numbers are known. Until a weekly-history
//        endpoint exists, the rest of the week is filled with placeholder
//        data generated from today's real total (see buildPlaceholderWeek
//        below) purely so the chart reads as populated. This is fake data
//        and is NOT wired to anything real - swap it out the moment
//        the backend week endpoint ships by passing `week` explicitly:
//
//   <AttendanceChart week={[{ label: "Mon", present: 40, absent: 5 }, ...]} />
//     -> plots the real week, Monday - Saturday, present vs absent only.

"use client";

import { useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Users, TrendingUp } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Filler,
  ChartTooltip,
);

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRESENT_COLOR = "#10B981"; // emerald-500
const ABSENT_COLOR = "#F43F5E"; // rose-500

function todayLabel() {
  const jsDay = new Date().getDay(); // 0 = Sun ... 6 = Sat
  return jsDay === 0 ? "Sat" : WEEKDAYS[jsDay - 1];
}

// Soft top-to-bottom gradient fill under a line, tied to the chart's own
// canvas so it scales correctly on resize.
function verticalGradient(ctx, chartArea, hexColor, topAlpha = 0.28) {
  if (!chartArea) return `${hexColor}22`;
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(
    0,
    `${hexColor}${Math.round(topAlpha * 255)
      .toString(16)
      .padStart(2, "0")}`,
  );
  gradient.addColorStop(1, `${hexColor}00`);
  return gradient;
}

// FAKE DATA - placeholder only, until the backend weekly-history endpoint
// exists (see api.getMyAttendanceWeek / api.getMyWeeklySummaries).
// Deterministic per day (same seed -> same output on every render, no
// flicker), scaled off today's real total so the shape looks plausible
// instead of a flat guess. Today's own slot always uses the real numbers.
function buildPlaceholderWeek(present, absent) {
  const total = Math.max(1, Number(present) || 0 + Number(absent) || 0);
  const realTotal = (Number(present) || 0) + (Number(absent) || 0);
  const base = realTotal > 0 ? realTotal : 24;
  const today = todayLabel();

  // Small deterministic variation per weekday so the line isn't flat.
  const dayFactor = {
    Mon: 0.94,
    Tue: 1.02,
    Wed: 0.97,
    Thu: 1.05,
    Fri: 0.9,
    Sat: 0.85,
  };

  return WEEKDAYS.map((label) => {
    if (label === today && realTotal > 0) {
      return {
        label,
        present: Number(present) || 0,
        absent: Number(absent) || 0,
      };
    }
    const dayTotal = Math.max(1, Math.round(base * (dayFactor[label] ?? 1)));
    // Aim for a healthy ~85-92% present rate, nudged per day.
    const presentRatio = 0.85 + (dayFactor[label] - 0.85) * 0.3;
    const dayPresent = Math.max(
      0,
      Math.round(dayTotal * Math.min(0.97, Math.max(0.75, presentRatio))),
    );
    const dayAbsent = Math.max(0, dayTotal - dayPresent);
    return { label, present: dayPresent, absent: dayAbsent };
  });
}

export default function AttendanceChart({ present = 0, absent = 0, week }) {
  const chartRef = useRef(null);
  const hasWeek = Array.isArray(week) && week.length > 0;

  // Normalize into { label, present, absent }[] for Mon - Sat only.
  const points = useMemo(() => {
    if (hasWeek) {
      return WEEKDAYS.map((label) => {
        const match = week.find((d) => d.label === label);
        return {
          label,
          present: match ? Number(match.present) || 0 : null,
          absent: match ? Number(match.absent) || 0 : null,
        };
      });
    }
    return buildPlaceholderWeek(present, absent);
  }, [hasWeek, week, present, absent]);

  const total = points.reduce(
    (acc, p) => acc + (p.present || 0) + (p.absent || 0),
    0,
  );

  const today = todayLabel();
  const todaysPoint =
    points.find((p) => p.label === today) || points[points.length - 1];
  const todayTotal = (todaysPoint?.present || 0) + (todaysPoint?.absent || 0);
  const todayPct = todayTotal
    ? Math.round(((todaysPoint.present || 0) / todayTotal) * 100)
    : null;

  const chartData = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label: "Present",
        data: points.map((p) => p.present),
        borderColor: PRESENT_COLOR,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          return verticalGradient(ctx, chartArea, PRESENT_COLOR);
        },
        pointBackgroundColor: PRESENT_COLOR,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: points.length === 1 ? 6 : 3.5,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2.5,
        borderWidth: 2.5,
        tension: 0.4,
        spanGaps: true,
        fill: "start",
      },
      {
        label: "Absent",
        data: points.map((p) => p.absent),
        borderColor: ABSENT_COLOR,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          return verticalGradient(ctx, chartArea, ABSENT_COLOR, 0.18);
        },
        pointBackgroundColor: ABSENT_COLOR,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: points.length === 1 ? 6 : 3.5,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2.5,
        borderWidth: 2.5,
        tension: 0.4,
        spanGaps: true,
        fill: "start",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: "easeOutCubic" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15, 23, 42, 0.94)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        padding: 10,
        cornerRadius: 10,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 3,
        titleFont: { size: 11, weight: "600" },
        bodyFont: { size: 11 },
        borderColor: "rgba(148,163,184,0.15)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11, weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.12)" },
        border: { display: false },
        ticks: { color: "#94a3b8", font: { size: 10 }, precision: 0 },
      },
    },
  };

  if (!total) {
    return (
      <div className="h-[260px] flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
        <Users size={28} strokeWidth={1.5} />
        <p className="text-xs font-medium">No attendance recorded yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-4">
          <LegendPill
            color={PRESENT_COLOR}
            label="Present"
            value={todaysPoint?.present}
          />
          <LegendPill
            color={ABSENT_COLOR}
            label="Absent"
            value={todaysPoint?.absent}
          />
        </div>
        {todayPct != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold font-mono ${
              todayPct >= 90
                ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : todayPct >= 75
                  ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300"
            }`}
          >
            <TrendingUp size={11} />
            {todayPct}% today
          </span>
        )}
      </div>

      {!hasWeek && (
        <p className="px-0.5 pb-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Showing this week - only {today}&apos;s numbers are live; other days
          are estimated.
        </p>
      )}
      <div className="relative h-[220px] w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}

function LegendPill({ color, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}1A` }}
      />
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200">
        {value ?? "—"}
      </span>
    </div>
  );
}
