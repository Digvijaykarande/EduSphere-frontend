// src/app/dashboard/exams/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import PrincipalOverview from "@/components/pages/dashboard/exams/PrincipleOverview";
import StudentOverview from "@/components/pages/dashboard/exams/StudentOverview";
import GradebookTable from "@/components/pages/dashboard/exams/GradebookTable";
import CreateExamModal from "@/components/pages/dashboard/exams/CreateExamModal";
import AllExamsList from "@/components/pages/dashboard/exams/AllExamsList";
import ExamSchedule from "@/components/pages/dashboard/exams/ExamSchedule";
import ResultsManagement from "@/components/pages/dashboard/exams/ResultsManagement";
import AnalyticsDashboard from "@/components/pages/dashboard/exams/AnalyticsDashboard";
import { useAuthStore } from "@/store/authStore";
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

const TABS = [
  "Overview",
  "All Exams",
  "Schedule",
  "Results",
  "Analytics",
  "Gradebook",
];

// Roles allowed to manage exams (create/edit/delete, enter marks, view
// principal-only analytics). Everyone else gets the read-only student view.
// Mirrors MANAGE_ROLES in the events module — update here if your TEACHER
// role string ever diverges between modules.
const MANAGE_ROLES = ["SCHOOL", "TEACHER"];

export default function ExamsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const canManage = MANAGE_ROLES.includes(role);

  const [activeTab, setActiveTab] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradebookExamId, setGradebookExamId] = useState(null);

  const exams = useExamStore((s) => s.exams);
  const fetchExams = useExamStore((s) => s.fetchExams);

  // The Gradebook tab needs the exam list for its picker below. Only fetch
  // it for roles that can actually reach that tab.
  useEffect(() => {
    if (canManage) fetchExams({ limit: 100 }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  // Default the gradebook picker to the first exam once the list loads.
  useEffect(() => {
    if (!gradebookExamId && exams.length > 0) {
      setGradebookExamId(exams[0].slug || exams[0]._id);
    }
  }, [exams, gradebookExamId]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6 pb-20 sm:pb-0">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Exams Dashboard
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage exams, schedules, results and analytics
          </p>
        </div>
        {canManage && (
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 shadow-md transition-all"
            >
              <Plus size={16} /> Create Exam
            </Button>
          </div>
        )}
      </div>

      {/* Mobile floating Create Exam button */}
      {canManage && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="sm:hidden fixed bottom-5 right-5 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-2xl active:scale-95 transition-transform p-0"
          aria-label="Create Exam"
        >
          <Plus size={22} />
        </Button>
      )}

      {canManage ? (
        <>
          {/* Custom Tab Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="exam-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Conditional Rendering based on Tab */}
          <div className="mt-4 sm:mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "Overview" && (
                  <PrincipalOverview
                    onNavigateTab={setActiveTab}
                    onCreateExam={() => setIsModalOpen(true)}
                  />
                )}
                {activeTab === "All Exams" && <AllExamsList />}
                {activeTab === "Schedule" && <ExamSchedule />}
                {activeTab === "Results" && <ResultsManagement />}
                {activeTab === "Analytics" && <AnalyticsDashboard />}
                {activeTab === "Gradebook" && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
                        Select Exam to Grade
                      </Label>
                      <Select
                        value={gradebookExamId ?? ""}
                        onValueChange={(value) => setGradebookExamId(value)}
                        disabled={exams.length === 0}
                      >
                        <SelectTrigger className="w-full sm:w-72 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 h-auto text-xs font-semibold text-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-primary/20">
                          <SelectValue placeholder="No exams yet" />
                        </SelectTrigger>
                        <SelectContent>
                          {exams.map((exam) => (
                            <SelectItem
                              key={exam._id || exam.slug}
                              value={exam.slug || exam._id}
                            >
                              {exam.title} — {exam.subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <GradebookTable examId={gradebookExamId} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <StudentOverview />
      )}

      {/* Global Modals */}
      {canManage && (
        <CreateExamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => fetchExams({ limit: 100 }).catch(() => {})}
        />
      )}
    </div>
  );
}