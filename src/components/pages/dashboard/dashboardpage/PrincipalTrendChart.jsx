// components/pages/dashboard/dashboardpage/PrincipalTrendChart.jsx
//
// Simple, accurate school-wide Present vs Absent chart, Monday - Saturday.
// Built from the real daily trend (`data` = [{ date, pct }, ...] from
// getSchoolAttendanceTrend) combined with the real `totalStudents` count,
// so both series are genuine numbers - not decoration.
//
// No target line, no crosshair/sparkle overlays, no custom floating
// tooltip - styled close to the plain Chart.js line-chart reference, just
// dressed up with a soft gradient fill and a compact stat header.

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
import { TrendingUp } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Filler,
  ChartTooltip,
);

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PRESENT_COLOR = "#10B981"; // emerald-500
const ABSENT_COLOR = "#F43F5E"; // rose-500

// Soft top-to-bottom gradient fill under a line, tied to the chart's own
// canvas so it scales correctly on resize.
function verticalGradient(ctx, chartArea, hexColor, topAlpha = 0.26) {
  if (!chartArea) return `${hexColor}22`;
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(
    0,
    `${hexColor}${Math.round(topAlpha * 255).toString(16).padStart(2, "0")}`,
  );
  gradient.addColorStop(1, `${hexColor}00`);
  return gradient;
}

export default function PrincipalTrendChart({
  data = [],
  dataKey = "pct",
  dateKey = "date",
  totalStudents = 0,
  loading = false,
}) {
  const chartRef = useRef(null);

  // Keep only Monday - Saturday, in order, and convert the daily
  // attendance % into real present/absent counts using totalStudents.
  const points = useMemo(() => {
    const rows = (data || [])
      .map((d) => {
        const dt = new Date(d[dateKey]);
        if (Number.isNaN(dt.getTime())) return null;
        const day = dt.getDay(); // 0 = Sun
        if (day === 0) return null; // drop Sunday
        const pct = Number(d[dataKey] ?? d.value ?? d.attendancePct ?? 0);
        const total = Number(totalStudents) || 0;
        const present = total ? Math.round((pct / 100) * total) : null;
        const absent =
          total && present != null ? Math.max(0, total - present) : null;
        return {
          label: WEEKDAY_LABELS[day],
          date: dt,
          pct,
          present,
          absent,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.date - b.date);
    return rows;
  }, [data, dataKey, dateKey, totalStudents]);

  const hasCounts = points.some((p) => p.present != null);
  const latest = points[points.length - 1];
  const latestPct = latest ? Math.round(latest.pct) : null;
  const trendDelta =
    points.length > 1 ? Math.round(latest.pct - points[0].pct) : null;

  if (loading) {
    return (
      <div className="h-[280px] w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
    );
  }

  if (!points.length) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
        <TrendingUp size={28} strokeWidth={1.5} />
        <p className="text-xs font-medium">
          No attendance trend data available.
        </p>
      </div>
    );
  }

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
        pointRadius: 3.5,
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
          return verticalGradient(ctx, chartArea, ABSENT_COLOR, 0.16);
        },
        pointBackgroundColor: ABSENT_COLOR,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3.5,
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-4">
          <LegendPill color={PRESENT_COLOR} label="Present" value={latest?.present} />
          <LegendPill color={ABSENT_COLOR} label="Absent" value={latest?.absent} />
        </div>
        {latestPct != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold font-mono ${
              latestPct >= 90
                ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : latestPct >= 75
                  ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300"
            }`}
          >
            <TrendingUp size={11} />
            {latestPct}%
            {trendDelta != null && trendDelta !== 0
              ? ` (${trendDelta > 0 ? "+" : ""}${trendDelta} vs Mon)`
              : ""}
          </span>
        )}
      </div>

      {!hasCounts && (
        <p className="px-0.5 pb-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Present/Absent counts need total student count to display accurately.
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