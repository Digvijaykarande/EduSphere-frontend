import { CreditCard, AlertCircle, FileText, Cloud } from "lucide-react";

export const NOTIFICATION_META = {
  fee: { icon: CreditCard, tone: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
  attendance: { icon: AlertCircle, tone: "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400" },
  exam: { icon: FileText, tone: "bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400" },
  system: { icon: Cloud, tone: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400" },
};

export const seedNotifications = [
  { id: "n1", type: "fee", title: "Fee payment received", message: "Invoice #9401 cleared for student ID #104.", time: "10 mins ago", read: false },
  { id: "n2", type: "attendance", title: "Attendance below threshold", message: "3 students in Grade 9B are below 75% attendance.", time: "1 hour ago", read: false },
  { id: "n3", type: "exam", title: "Exam schedule published", message: "Mid-term timetable for Grade 10 is now live.", time: "3 hours ago", read: false },
  { id: "n4", type: "system", title: "Backup completed", message: "Nightly system backup finished successfully.", time: "Yesterday", read: true },
];