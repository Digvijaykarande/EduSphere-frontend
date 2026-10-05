"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const FALLBACK_DATA = [
  { name: "Mon", rate: 94 },
  { name: "Tue", rate: 96 },
  { name: "Wed", rate: 92 },
  { name: "Thu", rate: 97 },
  { name: "Fri", rate: 95 },
  { name: "Sat", rate: 85 },
];

// Backend trend rows look like { date: "2026-08-10T00:00:00.000Z", total,
// present, attendancePct }. Map to recharts' { name, rate } shape here so
// the chart component itself stays presentation-only.
function toChartSeries(rows) {
  return rows.map((r) => ({
    name: new Date(r.date).toLocaleDateString("en-US", { weekday: "short" }),
    rate: r.attendancePct,
  }));
}

export default function AttendanceChart({ data }) {
  const series = data && data.length > 0 ? toChartSeries(data) : FALLBACK_DATA;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3454d1" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#3454d1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#8891a8" style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }} />
          <YAxis domain={[80, 100]} axisLine={false} tickLine={false} stroke="#8891a8" style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }} />
          <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e1e5ee", borderRadius: "8px", fontFamily: "var(--font-body)" }} />
          <Area type="monotone" dataKey="rate" stroke="#3454d1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" name="Attendance %" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
