// src/components/pages/dashboard/AddTeacher/constants.js

export const GENDER_OPTIONS = ["Male", "Female", "Other"];

export const SUBJECT_OPTIONS = [
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "Hindi",
  "Marathi",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Economics",
  "Physical Education",
];

export const QUALIFICATION_OPTIONS = [
  "B.Ed",
  "M.Ed",
  "B.Sc, B.Ed",
  "M.Sc",
  "M.A.",
  "Ph.D",
  "NET/SET Qualified",
];

// TODO: replace with GET /api/school/classes (or similar) once the
// backend exposes school-specific class/section data.
export const CLASS_OPTIONS = [
  "Nursery",
  "LKG",
  "UKG",
  "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10",
  "11", "12",
];

export const SECTION_OPTIONS = ["A", "B", "C", "D"];

/**
 * Non-teaching staff sub-roles. Value must match backend STAFF_TYPES
 * (src/models/constants.js) exactly.
 */
export const STAFF_TYPE_OPTIONS = [
  { value: "LAB_ASSISTANT", label: "Lab Assistant" },
  { value: "LIBRARIAN", label: "Librarian" },
  { value: "CASHIER", label: "Cashier" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "OFFICE_CLERK", label: "Office Clerk" },
  { value: "OTHER", label: "Other Staff" },
];

export const STAFF_DEPARTMENT_OPTIONS = [
  "Library",
  "Science Lab",
  "Computer Lab",
  "Accounts / Finance",
  "Front Office",
  "Administration",
  "Transport",
  "Other",
];

/**
 * The three account types the principal/teacher can create from this page.
 * `key` drives which form renders; `roleValue` is the backend User.role.
 */
export const ACCOUNT_TYPES = [
  { key: "teacher", label: "Teacher", roleValue: "TEACHER" },
  { key: "student", label: "Student", roleValue: "STUDENT" },
  { key: "staff", label: "Staff", roleValue: "STAFF" },
];
