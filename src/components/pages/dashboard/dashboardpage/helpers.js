import {
  Users,
  GraduationCap,
  CheckCircle2,
  Wallet,
  CalendarDays,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Layers,
} from "lucide-react";

/* ---------------------------- formatting ---------------------------- */

// Compact Indian-format currency: ₹4.8Cr / ₹3.2L / ₹42,500.
export function formatINRCompact(n) {
  const v = Number(n || 0);
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2).replace(/\.00$/, "")}Cr`;
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(2).replace(/\.00$/, "")}L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const todayLabel = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const todayISO = () => new Date().toISOString().split("T")[0];

export const ROLE_LABEL = {
  SUPER_ADMIN: "Administrator",
  SCHOOL: "Principal",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

/* ---------------------------- animation ---------------------------- */

export const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/* ---------------------------- quick actions ---------------------------- */

const STUDENT_ACTIONS = [
  { href: "/dashboard/attendance", label: "My Attendance", icon: CheckCircle2, tone: "green" },
  { href: "/dashboard/academics", label: "Homework", icon: BookOpen, tone: "violet" },
  { href: "/dashboard/fees", label: "My Fees", icon: Wallet, tone: "orange" },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays, tone: "blue" },
];

const TEACHER_ACTIONS = [
  { href: "/dashboard/attendance", label: "Take Attendance", icon: CheckCircle2, tone: "green" },
  { href: "/dashboard/academics", label: "Post Homework", icon: BookOpen, tone: "violet" },
  { href: "/dashboard/exams", label: "Enter Marks", icon: ClipboardList, tone: "blue" },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays, tone: "orange" },
];

const PRINCIPAL_ACTIONS = [
  { href: "/dashboard/insert", label: "Add People", icon: Users, tone: "violet" },
  { href: "/dashboard/attendance", label: "Attendance", icon: CheckCircle2, tone: "green" },
  { href: "/dashboard/fees", label: "Fees", icon: Wallet, tone: "orange" },
  { href: "/dashboard/academics", label: "Academics", icon: BookOpen, tone: "blue" },
];

export function getQuickActions(isStudent, isTeacher) {
  if (isStudent) return STUDENT_ACTIONS;
  if (isTeacher) return TEACHER_ACTIONS;
  return PRINCIPAL_ACTIONS;
}

/* ---------------------------- stat card builders ---------------------------- */

export function buildStudentStats(data, studentDerived) {
  const a = data.attendance;
  const f = data.fee;

  return [
    {
      label: "My Attendance",
      value: a ? `${a.attendancePct}%` : "—",
      sub: a ? `${a.present}/${a.total} periods present` : "No records yet",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Present Periods",
      value: a ? String(a.present) : "—",
      sub: a ? `${a.absent} absent · ${a.late} late` : "—",
      icon: TrendingUp,
      tone: "violet",
    },
    {
      label: "Fees Due",
      value: f ? formatINRCompact(f.pendingAmount) : "—",
      sub: f ? f.status : "No fee assigned",
      icon: Wallet,
      tone: "orange",
    },
    {
      label: "Homework Pending",
      value: String(studentDerived.pendingHw),
      sub: `${(data.homework || []).length} total assigned`,
      icon: ClipboardList,
      tone: "blue",
    },
  ];
}

export function buildTeacherStats(data, teacherDerived) {
  return [
    {
      label: "My Classes",
      value: String(teacherDerived.classes),
      sub: `${teacherDerived.subjects} subject${teacherDerived.subjects === 1 ? "" : "s"} taught`,
      icon: Layers,
      tone: "violet",
    },
    {
      label: "Classes Today",
      value: String((data.summaries || []).length),
      sub: "Sections on your timetable",
      icon: CalendarDays,
      tone: "blue",
    },
    {
      label: "Present Rate Today",
      value: teacherDerived.presentRate == null ? "—" : `${teacherDerived.presentRate}%`,
      sub: teacherDerived.presentRate == null ? "Not marked yet" : "Across your sections",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Homework Posted",
      value: String(teacherDerived.homework),
      sub: "Active assignments",
      icon: BookOpen,
      tone: "orange",
    },
  ];
}

export function buildPrincipalStats(data) {
  const s = data.schoolStats;
  const f = data.feeStats;

  return [
    {
      label: "Total Students",
      value: s ? s.totalStudents.toLocaleString("en-IN") : "—",
      sub: s ? `${s.totalSections} sections` : "—",
      icon: Users,
      tone: "violet",
    },
    {
      label: "Teachers",
      value: s ? String(s.totalTeachers) : "—",
      sub: s ? `${s.teachersMarkedToday} active today` : "—",
      icon: GraduationCap,
      tone: "blue",
    },
    {
      label: "Avg Attendance",
      value: s ? `${s.avgAttendancePct7d}%` : "—",
      sub: "Last 7 days",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Fees Collected",
      value: f ? formatINRCompact(f.totalCollected) : "—",
      sub: f ? `${f.collectionRate}% of billed` : "—",
      icon: Wallet,
      tone: "orange",
    },
  ];
}
