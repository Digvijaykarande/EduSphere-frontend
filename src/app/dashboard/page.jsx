// app/dashboard/page.jsx

"use client";
import PageWrapper from "@/components/common/dashboard/PageWrapper";
import { useAuthStore } from "@/store/authStore";
import {
  DashboardHeader,
  QuickActionsBar,
  StatsGrid,
} from "@/components/pages/dashboard/dashboardpage/SharedUI";
import {
  PrincipalOverview,
  TeacherOverview,
  StudentOverview,
} from "@/components/pages/dashboard/dashboardpage/RoleOverviews";
import { useDashboardData } from "@/components/pages/dashboard/dashboardpage/useDashboardData";
import {
  getQuickActions,
  buildStudentStats,
  buildTeacherStats,
  buildPrincipalStats,
} from "@/components/pages/dashboard/dashboardpage/helpers";

export default function DashboardHub() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || null;

  const isPrincipal = role === "SCHOOL" || role === "SUPER_ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  const { loading, data, teacherDerived, studentDerived } = useDashboardData(
    role,
    isStudent,
    isTeacher,
  );

  const stats = isStudent
    ? buildStudentStats(data, studentDerived)
    : isTeacher
      ? buildTeacherStats(data, teacherDerived)
      : buildPrincipalStats(data);

  const quickActions = getQuickActions(isStudent, isTeacher);

  const displayName = user?.name || "there";
  const schoolName = user?.school?.name || "EduSphere";

  return (
    <PageWrapper className="max-w-[1600px] mx-auto space-y-6">
      <DashboardHeader
        role={role}
        displayName={displayName}
        schoolName={schoolName}
      />

      {/* <QuickActionsBar actions={quickActions} /> */}

      <StatsGrid loading={loading} stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isPrincipal && <PrincipalOverview data={data} loading={loading} teacherDerived={teacherDerived} />}
        {isTeacher && <TeacherOverview data={data} teacherDerived={teacherDerived} />}
        {isStudent && <StudentOverview data={data} studentDerived={studentDerived} />}
      </div>
    </PageWrapper>
  );
}
