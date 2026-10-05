"use client";

import { useAuthStore } from "@/store/authStore";
import { getDisplayRole } from "@/store/attendance.utils";
import StudentAcademics from "@/components/pages/dashboard/academics/StudentAcademics";
import TeacherAcademics from "@/components/pages/dashboard/academics/TeacherAcademics";
import PrincipalAcademics from "@/components/pages/dashboard/academics/PrincipalAcademics";

export default function AcademicsPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  const roleTitle = getDisplayRole(user.role) || user.role;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Academics</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary font-bold">Academics</span>
          </div>
        </div>
      </div>

      {/* Viewing-as indicator */}
      <p className="text-xs text-slate-400 -mt-4">
        Viewing as <span className="font-semibold text-slate-600 dark:text-slate-300">{user.name}</span> · {roleTitle}
      </p>

      {/* Role-specific view — driven by real auth, not a manual toggle */}
      {user.role === "STUDENT" && <StudentAcademics />}
      {user.role === "TEACHER" && <TeacherAcademics />}
      {user.role === "SCHOOL" && <PrincipalAcademics />}
    </div>
  );
}
