export const STATUS_META = {
  Open: {
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
    dot: "#3b82f6",
  },
  "In Progress": {
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    dot: "#f59e0b",
  },
  Resolved: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    dot: "#10b981",
  },
  Closed: {
    badge: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20",
    dot: "#94a3b8",
  },
};

export const STATUS_LIST = ["Open", "In Progress", "Resolved", "Closed"];

export const PRIORITY_META = {
  High: { badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20" },
  Medium: { badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20" },
  Low: { badge: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20" },
};

export const PRIORITY_LIST = ["High", "Medium", "Low"];
export const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export const CATEGORY_LIST = ["IT / Portal", "IT / Hardware", "Finance", "Administrative", "Transport", "Exams", "Attendance", "Other"];
export const ROLE_LIST = ["Student", "Parent", "Teacher", "Faculty"];
export const STAFF_LIST = ["Neha Sharma", "Rohit Iyer", "Ananya Menon", "Unassigned"];

export function formatAgo(minutes) {
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export const emptyDraft = {
  subject: "",
  description: "",
  requesterName: "",
  requesterRole: "Student",
  category: "IT / Portal",
  priority: "Medium",
};

export const seedTickets = [
  {
    id: "TCK-1256",
    subject: "Unable to access student portal",
    description: 'I am unable to login to the student portal. It shows "Invalid credentials" even though I am using the correct password.',
    requester: { name: "Nilesh Verma", role: "Parent" },
    category: "IT / Portal",
    priority: "High",
    status: "Open",
    minutesAgo: 10,
    assignedTo: "Neha Sharma",
    attachments: [{ name: "Login_Error_Screenshot.pdf", size: "1.2 MB" }],
    conversation: [
      { author: "Rahul Verma", time: "10:15 AM", text: 'I am unable to login to the student portal. It shows "Invalid credentials" even though I am using the correct password.', self: false },
      { author: "Neha Sharma", time: "10:25 AM", text: "Hi Rahul, thank you for reaching out. Please try resetting your password. Let us know if it works.", self: true },
    ],
  },
  {
    id: "TCK-1255",
    subject: "Fee receipt not generating",
    description: "The fee receipt for invoice #9401 is not generating in PDF format from the parent dashboard.",
    requester: { name: "Sunita Desai", role: "Parent" },
    category: "Finance",
    priority: "Medium",
    status: "In Progress",
    minutesAgo: 60,
    assignedTo: "Rohit Iyer",
    attachments: [],
    conversation: [
      { author: "Sunita Desai", time: "9:40 AM", text: "The fee receipt is not generating in PDF format. Can someone check this?", self: false },
    ],
  },
  {
    id: "TCK-1254",
    subject: "Issue with exam timetable",
    description: "The exam timetable for class 10B is not visible on the student side.",
    requester: { name: "Amit Kumar", role: "Student" },
    category: "Exams",
    priority: "Low",
    status: "Open",
    minutesAgo: 120,
    assignedTo: "Unassigned",
    attachments: [],
    conversation: [
      { author: "Amit Kumar", time: "8:30 AM", text: "The exam timetable for class 10B is not visible on my end. Could you check?", self: false },
    ],
  },
  {
    id: "TCK-1253",
    subject: "Transport route not updated",
    description: "Our area is not covered in the transport route for the next term.",
    requester: { name: "Priya Singh", role: "Parent" },
    category: "Transport",
    priority: "Medium",
    status: "In Progress",
    minutesAgo: 300,
    assignedTo: "Ananya Menon",
    attachments: [],
    conversation: [
      { author: "Priya Singh", time: "Yesterday", text: "Our area is not covered in the new transport route. Please advise.", self: false },
      { author: "Ananya Menon", time: "Yesterday", text: "Looking into this with the transport team, will update you shortly.", self: true },
    ],
  },
];