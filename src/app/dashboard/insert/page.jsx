import AddTeacherPage from "@/components/pages/dashboard/AddTeacher/AddTeacherPage";
import RoleGuard from "@/components/common/dashboard/RoleGuard";

export const metadata = {
  title: "Add Teacher/Student — EduSphere",
};

export default function Page() {
  return (
    <RoleGuard allowedRoles={["super_admin", "school","teacher"]}>
      <AddTeacherPage />
    </RoleGuard>
  );
}