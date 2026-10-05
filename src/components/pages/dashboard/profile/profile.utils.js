import { ShieldCheck, Landmark, GraduationCap } from "lucide-react";

export const ROLE_META = {
  "Super Admin": { icon: ShieldCheck, badge: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40" },
  Principal: { icon: Landmark, badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/40" },
  Teacher: { icon: GraduationCap, badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40" },
};

export const ROLE_SEED_DATA = {
  "Super Admin": {
    fullName: "Admin User",
    email: "admin@edusphere.com",
    phone: "+91 98765 43210",
    address: "123 Education Street, Knowledge City, Bangalore, Karnataka 560001",
    bio: "Passionate about education and technology.",
    stats: [
      { label: "Employee ID", value: "ADM001" },
      { label: "Department", value: "Administration" },
      { label: "Access Level", value: "Full System Access" },
    ],
  },
  Principal: {
    fullName: "Dr. Meera Kulkarni",
    email: "principal@edusphere.com",
    phone: "+91 98123 45678",
    address: "45 Scholars Avenue, Bangalore, Karnataka 560002",
    bio: "Leading the school's academic vision and student development.",
    stats: [
      { label: "Employee ID", value: "PRN001" },
      { label: "Department", value: "Academic Administration" },
      { label: "Reporting To", value: "Board of Trustees" },
      { label: "Qualification", value: "Ph.D. in Education Leadership" },
      { label: "Experience", value: "18 years" },
    ],
  },
  Teacher: {
    fullName: "Rohit Iyer",
    email: "rohit.iyer@edusphere.com",
    phone: "+91 97456 78901",
    address: "12 Greenview Lane, Bangalore, Karnataka 560034",
    bio: "Enjoys making math approachable through real-world problem solving.",
    stats: [
      { label: "Employee ID", value: "TCH014" },
      { label: "Department", value: "Mathematics" },
      { label: "Qualification", value: "M.Sc. Mathematics, B.Ed." },
      { label: "Experience", value: "7 years" },
    ],
    chips: {
      "Subjects Taught": ["Mathematics", "Statistics"],
      "Classes Assigned": ["Grade 9-A", "Grade 10-B", "Grade 10-C"],
    },
  },
};

export const inputClass =
  "w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-400 transition-all duration-200 shadow-sm";