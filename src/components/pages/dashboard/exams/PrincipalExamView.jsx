"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, FileSpreadsheet } from "lucide-react";
import GradeAnalyticsChart from "./GradeAnalyticsChart";
import GradebookTable from "./GradebookTable";
import CreateExamModal from "./CreateExamModal";
import { useExamStore } from "@/store/examStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PrincipalExamView() {
  const exams = useExamStore((s) => s.exams);
  const fetchExams = useExamStore((s) => s.fetchExams);
  const stats = useExamStore((s) => s.stats);
  const fetchStats = useExamStore((s) => s.fetchStats);

  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchExams({ limit: 100 }).catch(() => {});
    fetchStats().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedExamId && exams.length > 0) {
      setSelectedExamId(exams[0].slug || exams[0]._id);
    }
  }, [exams, selectedExamId]);

  const handleCreated = () => {
    setIsCreateOpen(false);
    fetchExams({ limit: 100 }).catch(() => {});
    fetchStats().catch(() => {});
  };

  const kpis = [
    {
      label: "Class Average",
      value: stats?.averageScore ?? "—",
      subtext: "Across all published results",
      bg: "bg-emerald-500/10",
      color: "text-emerald-600 border-emerald-500/20",
    },
    {
      label: "Pass Rate",
      value: stats?.passPercentage ?? "—",
      subtext: "Across all published results",
      bg: "bg-amber-500/10",
      color: "text-amber-600 border-amber-500/20",
    },
    {
      label: "Total Exams",
      value: stats?.totalExams ?? "—",
      subtext: `${stats?.upcomingExams ?? 0} upcoming`,
      bg: "bg-rose-500/10",
      color: "text-rose-600 border-rose-500/20",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold border ${stat.bg} ${stat.color}`}>
              {stat.subtext}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GradeAnalyticsChart />
        </div>

        <div className="lg:col-span-2">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Select Exam to Grade
              </Label>
              <Select
                value={selectedExamId ?? ""}
                onValueChange={(val) => setSelectedExamId(val)}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.length === 0 && <SelectItem value="">No exams yet</SelectItem>}
                  {exams.map((exam) => (
                    <SelectItem key={exam._id || exam.slug} value={exam.slug || exam._id}>
                      {exam.title} — {exam.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <FileSpreadsheet size={14} className="mr-1.5" /> Export CSV
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="flex-1 sm:flex-none"
              >
                <Plus size={14} className="mr-1.5" /> Create Exam
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <GradebookTable examId={selectedExamId} />
          </div>
        </div>
      </div>

      <CreateExamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />
    </motion.div>
  );
}
