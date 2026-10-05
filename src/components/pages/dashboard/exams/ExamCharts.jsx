// src/components/pages/dashboard/exams/ExamCharts.jsx
"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { name: "Unit Test 1", score: 65 }, { name: "Unit Test 2", score: 72 },
  { name: "Mid Term", score: 68 }, { name: "Unit Test 3", score: 85 }, { name: "Final Term", score: 92 },
];

const subjectData = [
  { name: "Mathematics", value: 35, color: "#6366f1" },
  { name: "Science", value: 25, color: "#10b981" },
  { name: "English", value: 20, color: "#f59e0b" },
  { name: "Social Science", value: 20, color: "#3b82f6" },
];

export function PerformanceAreaChart() {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
          <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectDonutChart() {
  return (
    <div className="h-48 w-full relative mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={subjectData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
            {subjectData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] text-slate-400 font-bold uppercase">Overall</span>
        <span className="text-xl font-bold text-slate-900 dark:text-white">78.6%</span>
      </div>
    </div>
  );
}