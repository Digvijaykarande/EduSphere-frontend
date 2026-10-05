"use client";

import React from "react";
import PageWrapper from "@/components/common/dashboard/PageWrapper";
import { getScopeForBackendRole } from "@/store/attendance.utils";
import { useAuthStore } from "@/store/authStore";
import TeacherAttendancePage from "@/components/pages/dashboard/attendance/components/Teacherattendancepage";
import StudentAttendanceView from "@/components/pages/dashboard/attendance/components/Studentattendanceview";
import PrincipalAttendanceView from "@/components/pages/dashboard/attendance/components/Principalattendanceview";

export default function AttendancePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  const scope = getScopeForBackendRole(user.role) || "class";

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Attendance
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Dashboard <span className="mx-1">›</span> Attendance
          </p>
        </div>
      </div>

      {/* Render the correct component based on the logged-in user's real role */}
      {scope === "self" && <StudentAttendanceView />}
      {scope === "class" && <TeacherAttendancePage />}
      {scope === "school" && <PrincipalAttendanceView />}
    </PageWrapper>
  );
}
