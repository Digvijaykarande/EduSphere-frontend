// Display-facing role permission map. Keys are the human-readable labels
// used throughout the attendance UI (tabs, headers, etc.) — NOT the
// backend's ROLES enum. See ROLE_TO_SCOPE below for how a real logged-in
// user's backend role maps into this scope system.
export const ROLE_PERMISSIONS = {
  "Super Admin": { scope: "school" },
  Principal: { scope: "school" },
  Teacher: { scope: "class" },
  Student: { scope: "self" },
};

// Bridges the backend's ROLES enum (SUPER_ADMIN/SCHOOL/TEACHER/STUDENT,
// from useAuthStore's real `user.role`) to the scope this attendance module
// understands. This is the ONLY place that translation happens — components
// should call getScopeForBackendRole(user.role) rather than hardcoding role
// string comparisons themselves.
const BACKEND_ROLE_TO_LABEL = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL: "Principal",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

export function getDisplayRole(backendRole) {
  return BACKEND_ROLE_TO_LABEL[backendRole] || null;
}

export function getScopeForBackendRole(backendRole) {
  const label = getDisplayRole(backendRole);
  return label ? ROLE_PERMISSIONS[label]?.scope : null;
}

// --- Attendance-marking constants ---
// SUBJECTS mirrors the backend's hardcoded list in
// src/models/attendance.constants.js. If the backend list changes, update
// both — there is no server-driven config yet (SchoolConfig was deferred).
export const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
  "Physical Education",
  "Art",
  "Music",
];

export const PERIODS = [
  "1st Period (09:00 AM - 09:45 AM)",
  "2nd Period (10:00 AM - 10:45 AM)",
  "3rd Period (11:00 AM - 11:45 AM)",
];

export const STATUS_META = {
  present: {
    label: "Present",
    seat: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300",
  },
  absent: {
    label: "Absent",
    seat: "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-500/20 dark:border-rose-500/40 dark:text-rose-300",
  },
  late: {
    label: "Late",
    seat: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300",
  },
  "not-marked": {
    label: "Not Marked",
    seat: "bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500",
  },
};

export const STATUS_CYCLE = ["not-marked", "present", "absent", "late"];

export const inputClass =
  "dash-focus w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-700 dark:text-slate-200";
