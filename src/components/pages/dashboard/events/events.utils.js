export const CATEGORY_META = {
  "School Event": { dot: "#6d5ef8", bg: "#eef0ff", text: "#5b52f3" },
  Exam: { dot: "#3b82f6", bg: "#e8f1ff", text: "#2f6fed" },
  Meeting: { dot: "#f59e0b", bg: "#fff3e6", text: "#b45309" },
  Holiday: { dot: "#10b981", bg: "#e7f9f1", text: "#0ea86c" },
  Other: { dot: "#94a3b8", bg: "#f1f5f9", text: "#475569" },
};

export const CATEGORY_LIST = Object.keys(CATEGORY_META);
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const pad = (n) => String(n).padStart(2, "0");

export const toKey = (d) => {
  if (!d) return ""; // Protection for unmounting animations
  const dateObj = new Date(d);
  if (isNaN(dateObj)) return "";
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
};

export const sameDay = (a, b) => {
  if (!a || !b) return false;
  return toKey(a) === toKey(b);
};

export const addMonths = (d, delta) =>
  new Date(d.getFullYear(), d.getMonth() + delta, 1);

export const addDays = (d, delta) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + delta);
  return copy;
};

export const startOfWeek = (d) => {
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export function buildMonthGrid(viewDate) {
  if (!viewDate) return [];
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const gridStart = startOfWeek(firstOfMonth);
  const weeks = [];
  let cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(cursor));
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export function formatDayLabel(d) {
  if (!d) return ""; // Protection against null date during modal exit
  const dateObj = new Date(d);
  if (isNaN(dateObj)) return "";
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShort(d) {
  if (!d) return "";
  const dateObj = new Date(d);
  if (isNaN(dateObj)) return "";
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const emptyDraft = {
  title: "",
  category: "School Event",
  customCategoryLabel: "",
  start: "",
  end: "",
  location: "",
};

// Resolves what should actually be displayed for an event's category badge —
// falls back to the custom typed label when category is "Other".
export function getCategoryLabel(ev) {
  if (!ev) return "";
  return ev.category === "Other" && ev.customCategoryLabel
    ? ev.customCategoryLabel
    : ev.category;
}

export const seedEvents = [
  {
    id: "e1",
    title: "Staff Meeting",
    date: "2026-07-18",
    start: "11:00 AM",
    end: "12:00 PM",
    location: "Staff Room",
    category: "Meeting",
  },
  {
    id: "e2",
    title: "Parent Teacher Meeting",
    date: "2026-07-20",
    start: "10:00 AM",
    end: "01:00 PM",
    location: "Conference Room",
    category: "Meeting",
  },
  {
    id: "e3",
    title: "Maths Exam",
    date: "2026-07-25",
    start: "09:30 AM",
    end: "11:30 AM",
    location: "Exam Hall 1",
    category: "Exam",
  },
  {
    id: "e4",
    title: "English Exam",
    date: "2026-07-27",
    start: "09:30 AM",
    end: "12:30 PM",
    location: "Exam Hall 2",
    category: "Exam",
  },
  {
    id: "e5",
    title: "Science Exhibition",
    date: "2026-08-02",
    start: "10:00 AM",
    end: "04:00 PM",
    location: "Innovation Block",
    category: "School Event",
  },
  {
    id: "e6",
    title: "Department Meet",
    date: "2026-08-05",
    start: "02:00 PM",
    end: "03:00 PM",
    location: "Admin Block",
    category: "Meeting",
  },
  {
    id: "e7",
    title: "Annual Sports Day",
    date: "2026-08-15",
    start: "08:00 AM",
    end: "04:00 PM",
    location: "Main Athletic Ground",
    category: "School Event",
  },
  {
    id: "e8",
    title: "Prize Distribution Ceremony",
    date: "2026-08-15",
    start: "04:30 PM",
    end: "05:30 PM",
    location: "Auditorium",
    category: "School Event",
  },
  {
    id: "e9",
    title: "Independence Day",
    date: "2026-08-15",
    start: "All day",
    end: "",
    location: "Campus Wide",
    category: "Holiday",
  },
  {
    id: "e10",
    title: "Cultural Fest: Rhythm '26",
    date: "2026-10-24",
    start: "04:00 PM",
    end: "08:00 PM",
    location: "Open Amphitheater",
    category: "School Event",
  },
];
