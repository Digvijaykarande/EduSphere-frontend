"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

import ClassSectionFilter from "@/components/pages/dashboard/fees/ClassSectionFilter";
import StudentFeeDetailModal from "@/components/pages/dashboard/fees/StudentFeeDetailModal";
import StudentView from "@/components/pages/dashboard/fees/StudentView";
import FeesTable from "@/components/pages/dashboard/fees/FeesTable";
import AllocateFeesModal from "@/components/pages/dashboard/fees/AllocateFeesModal";
import { StatCard } from "@/components/pages/dashboard/fees/shared";
import { feeCategoryOptions } from "@/components/pages/dashboard/fees/mockData";
import { FeesPageHeader, FeesFilterBar } from "@/components/pages/dashboard/fees/FeesToolbar";
import { useFeesDashboard } from "@/components/pages/dashboard/fees/useFeesDashboard";
import { useAuthStore } from "@/store/authStore";

export default function FeesPage() {
  const user = useAuthStore((state) => state.user);
  // TEACHER and SCHOOL both see the principal dashboard (teacher is read-only,
  // enforced server-side); STUDENT sees their own view.
  const role = user?.role === "STUDENT" ? "student" : "principal";
  const canManageFees = user?.role === "SCHOOL" || user?.role === "SUPER_ADMIN";

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  const {
    selectedClass,
    setSelectedClass,
    selectedFeeCategory,
    setSelectedFeeCategory,
    statusTab,
    setStatusTab,
    searchTerm,
    setSearchTerm,
    schoolClasses,
    loading,
    error,
    refetchDashboard,
    classOptions,
    filteredStudents,
    feeStatsPrincipal,
  } = useFeesDashboard(role);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <FeesPageHeader
        showActions={role === "principal"}
        canManageFees={canManageFees}
        onAllocateClick={() => setShowAllocateModal(true)}
      />

      {role === "student" ? (
        <StudentView />
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading fees data…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center px-4">
          <AlertCircle className="h-6 w-6 text-rose-500" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Stat Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {feeStatsPrincipal.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Class & Section Selection Bar */}
          <ClassSectionFilter
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
            selectedFeeCategory={selectedFeeCategory}
            onFeeCategoryChange={setSelectedFeeCategory}
            classOptions={classOptions}
            feeCategoryOptions={feeCategoryOptions}
          />

          <FeesFilterBar
            statusTab={statusTab}
            setStatusTab={setStatusTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-4 items-start relative mt-4">
            <div
              className={`${
                selectedStudent ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"
              } transition-all duration-300 min-w-0`}
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <FeesTable
                  key={`${searchTerm}-${selectedClass}-${selectedFeeCategory}-${statusTab}`}
                  students={filteredStudents}
                  onSelectStudent={setSelectedStudent}
                  isProfileOpen={!!selectedStudent}
                />
              </div>
            </div>

            <AnimatePresence>
              {selectedStudent && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar rounded-2xl"
                >
                  <StudentFeeDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    canManageFees={canManageFees}
                    onChanged={refetchDashboard}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AllocateFeesModal
        open={showAllocateModal}
        onClose={() => setShowAllocateModal(false)}
        gradeClasses={schoolClasses.gradeClasses}
        onSaved={refetchDashboard}
      />
    </div>
  );
}