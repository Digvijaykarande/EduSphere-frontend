// src/components/pages/dashboard/exams/mockData.js

export const stats = {
  totalExams: 24,
  upcomingExams: 7,
  completedExams: 12,
  averageScore: "78.6%",
  passPercentage: "92.4%",
};

// Trend deltas for the KPI row (principal overview)
export const statsTrends = {
  totalExams: { direction: "up", value: "+3 this term" },
  upcomingExams: { direction: "flat", value: "next in 4 days" },
  completedExams: { direction: "up", value: "+5 vs last term" },
  averageScore: { direction: "up", value: "+2.1% vs last term" },
  passPercentage: { direction: "down", value: "-1.3% vs last term" },
};

export const upcomingExams = [
  { id: "e1", subject: "Mathematics", test: "Unit Test - 1", date: "24 May 2026", class: "10-A", students: 42 },
  { id: "e2", subject: "Full-Stack Web Dev", test: "Practical Exam", date: "27 May 2026", class: "10-A, 10-B", students: 84 },
  { id: "e3", subject: "Database Systems", test: "Half Yearly", date: "02 Jun 2026", class: "9-10", students: 156 },
  { id: "e4", subject: "Physics", test: "Practical Exam", date: "10 Jun 2026", class: "11-12", students: 128 },
];

export const recentResults = [
  { id: "r1", subject: "Object-Oriented Software Engineering", test: "Final Exam", date: "22 May 2026", class: "CS-301", status: "Published" },
  { id: "r2", subject: "Mathematics", test: "Unit Test - 2", date: "18 May 2026", class: "10-A", status: "Published" },
  { id: "r3", subject: "Science", test: "Mid Term Exam", date: "10 May 2026", class: "9-10", status: "Processing" },
];

export const topPerformers = [
  { id: 1, name: "Ananya Sharma", class: "10-A", score: "95.8%", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Rohan Verma", class: "10-B", score: "93.4%", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Diya Patel", class: "10-A", score: "91.2%", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Kabir Joshi", class: "10-B", score: "90.1%", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Meera Nair", class: "10-A", score: "89.5%", avatar: "https://i.pravatar.cc/150?u=5" },
];

// Students who need attention — surfaced on Analytics + Overview
export const atRiskStudents = [
  { id: "s21", name: "Aarav Mehta", class: "10-B", subject: "Mathematics", score: 38, trend: "down" },
  { id: "s22", name: "Ishaan Rao", class: "9-10", subject: "Physics", score: 42, trend: "down" },
  { id: "s23", name: "Sara Khan", class: "10-A", subject: "Database Systems", score: 45, trend: "flat" },
  { id: "s24", name: "Vivaan Gupta", class: "11-12", subject: "Chemistry", score: 39, trend: "down" },
];

export const allExamsList = [
  { id: "EX-1001", title: "Mid Term", subject: "Mathematics", class: "10-A", date: "15 Oct 2025", duration: "3 Hours", status: "Completed", type: "Theory", maxMarks: 100, passingMarks: 33, weightage: 20, syllabusCoverage: 100, questionPaper: "Uploaded", sections: ["10-A"] },
  { id: "EX-1002", title: "Unit Test 2", subject: "Physics", class: "11-B", date: "20 Nov 2025", duration: "1 Hour", status: "Completed", type: "Theory", maxMarks: 25, passingMarks: 9, weightage: 5, syllabusCoverage: 100, questionPaper: "Uploaded", sections: ["11-B"] },
  { id: "EX-1003", title: "Practical Assessment", subject: "Computer Science", class: "12-A", date: "10 Dec 2025", duration: "2 Hours", status: "Completed", type: "Practical", maxMarks: 50, passingMarks: 18, weightage: 10, syllabusCoverage: 100, questionPaper: "Uploaded", sections: ["12-A"] },
  { id: "EX-1004", title: "Final Board Mock", subject: "Object-Oriented Software Eng.", class: "CS-301", date: "22 May 2026", duration: "3 Hours", status: "Completed", type: "Theory", maxMarks: 100, passingMarks: 40, weightage: 25, syllabusCoverage: 100, questionPaper: "Uploaded", sections: ["CS-301"] },
  { id: "EX-1005", title: "Unit Test 1", subject: "Mathematics", class: "10-A", date: "24 May 2026", duration: "1.5 Hours", status: "Upcoming", type: "Theory", maxMarks: 50, passingMarks: 17, weightage: 10, syllabusCoverage: 80, questionPaper: "Pending", sections: ["10-A", "10-B"] },
  { id: "EX-1006", title: "Practical Exam", subject: "Full-Stack Web Dev", class: "CS-302", date: "27 May 2026", duration: "3 Hours", status: "Upcoming", type: "Practical", maxMarks: 100, passingMarks: 40, weightage: 20, syllabusCoverage: 65, questionPaper: "Pending", sections: ["CS-302"] },
  { id: "EX-1007", title: "Half Yearly", subject: "Database Systems", class: "9-10", date: "02 Jun 2026", duration: "2.5 Hours", status: "Upcoming", type: "Theory", maxMarks: 80, passingMarks: 28, weightage: 20, syllabusCoverage: 50, questionPaper: "Draft", sections: ["9-A", "9-B", "10-A"] },
  { id: "EX-1008", title: "Practical Exam", subject: "Physics", class: "11-12", date: "10 Jun 2026", duration: "2 Hours", status: "Upcoming", type: "Practical", maxMarks: 30, passingMarks: 11, weightage: 10, syllabusCoverage: 40, questionPaper: "Draft", sections: ["11-A", "12-A"] },
];

// KPI cards used on the Principal exam ledger view
export const examMetrics = [
  { label: "Class Average", value: "78.6%", subtext: "+2.1% vs last term", bg: "bg-emerald-500/10", color: "text-emerald-600 border-emerald-500/20" },
  { label: "Pass Rate", value: "92.4%", subtext: "-1.3% vs last term", bg: "bg-amber-500/10", color: "text-amber-600 border-amber-500/20" },
  { label: "Papers Pending Review", value: "6", subtext: "3 due this week", bg: "bg-rose-500/10", color: "text-rose-600 border-rose-500/20" },
];

export const courseList = [
  { id: "math-10a", name: "Mathematics — Class 10-A" },
  { id: "phy-11b", name: "Physics — Class 11-B" },
  { id: "cs-301", name: "Object-Oriented Software Eng. — CS-301" },
  { id: "web-302", name: "Full-Stack Web Dev — CS-302" },
];

// Grade distribution for the analytics bar chart
export const analyticsData = [
  { group: "A+", count: 18 },
  { group: "A", count: 34 },
  { group: "B", count: 52 },
  { group: "C", count: 29 },
  { group: "D", count: 12 },
  { group: "F", count: 5 },
];

// Subject-wise average performance, used for the analytics comparison chart
export const subjectPerformance = [
  { subject: "Mathematics", average: 74, lastTerm: 69 },
  { subject: "Physics", average: 68, lastTerm: 71 },
  { subject: "Computer Science", average: 88, lastTerm: 82 },
  { subject: "Database Systems", average: 79, lastTerm: 75 },
  { subject: "Full-Stack Web Dev", average: 91, lastTerm: 86 },
  { subject: "Chemistry", average: 63, lastTerm: 66 },
];

// Class-wise comparison, used on the Analytics tab
export const classComparison = [
  { class: "9-A", average: 72, passRate: 88 },
  { class: "9-B", average: 69, passRate: 84 },
  { class: "10-A", average: 81, passRate: 95 },
  { class: "10-B", average: 76, passRate: 90 },
  { class: "11-A", average: 74, passRate: 89 },
  { class: "12-A", average: 85, passRate: 97 },
];

// Term-over-term trend, used on the Analytics tab
export const termTrend = [
  { term: "UT-1", average: 65 },
  { term: "UT-2", average: 70 },
  { term: "Mid Term", average: 68 },
  { term: "UT-3", average: 76 },
  { term: "Half Yearly", average: 79 },
  { term: "Final Term", average: 82 },
];

export const examTimetable = [
  { subject: "Mathematics", date: "24 May 2026", time: "09:00 – 10:30", room: "Room 204", status: "Upcoming" },
  { subject: "Full-Stack Web Dev (Practical)", date: "27 May 2026", time: "10:00 – 13:00", room: "Lab 3", status: "Upcoming" },
  { subject: "Database Systems", date: "02 Jun 2026", time: "09:00 – 11:30", room: "Room 118", status: "Upcoming" },
  { subject: "Object-Oriented Software Eng.", date: "22 May 2026", time: "09:00 – 12:00", room: "Room 204", status: "Completed" },
];

export const studentReportCard = [
  { subject: "Mathematics", score: 88, grade: "A" },
  { subject: "Physics", score: 74, grade: "B" },
  { subject: "Object-Oriented Software Eng.", score: 92, grade: "A+" },
  { subject: "Full-Stack Web Dev", score: 95, grade: "A+" },
  { subject: "Database Systems", score: 81, grade: "A" },
];

// Helper to generate dynamic students for pagination testing
export const generateStudents = (subject, count = 25) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `STU-${i + 1}`,
    name: `Student ${i + 1}`,
    rollNo: `R-${100 + i}`,
    rawScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
    subject: subject,
  }));
};

// Exams awaiting result publication — powers the Results tab
export const resultsQueue = [
  { id: "EX-1001", title: "Mid Term ", subject: "Mathematics", class: "10-A", date: "15 Oct 2025", entered: 42, total: 42, status: "Published" },
  { id: "EX-1002", title: "Unit Test 2", subject: "Physics", class: "11-B", date: "20 Nov 2025", entered: 38, total: 38, status: "Published" },
  { id: "EX-1003", title: "Practical Assessment", subject: "Computer Science", class: "12-A", date: "10 Dec 2025", entered: 30, total: 30, status: "Published" },
  { id: "EX-1004", title: "Final Board Mock", subject: "Object-Oriented Software Eng.", class: "CS-301", date: "22 May 2026", entered: 56, total: 56, status: "Processing" },
  { id: "EX-1005", title: "Unit Test 1", subject: "Mathematics", class: "10-A", date: "24 May 2026", entered: 0, total: 42, status: "Not Started" },
  { id: "EX-1007", title: "Half Yearly", subject: "Database Systems", class: "9-10", date: "02 Jun 2026", entered: 96, total: 156, status: "Processing" },
];