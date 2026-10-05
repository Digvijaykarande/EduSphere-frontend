const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = network/connection error
    this.data = data; // raw parsed body, useful for field-level errors
  }
}

async function request(
  endpoint,
  { method = "GET", body, headers = {}, query } = {},
) {
  let url = `${API_BASE_URL}${endpoint}`;
  if (query) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      usp.set(k, String(v));
    }
    const qs = usp.toString();
    if (qs) url += `?${qs}`;
  }

  const config = {
    method,
    credentials: "include", // send/receive httpOnly cookies
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };
  if (body !== undefined) config.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new ApiError(
      `Can't reach the server. Is the backend running on ${API_BASE_URL}?`,
      0,
      null,
    );
  }

  // Some endpoints may return 204 / empty body.
  let text = await response.text();
  let resJson = null;
  if (text) {
    try {
      resJson = JSON.parse(text);
    } catch {
      resJson = { message: text };
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !endpoint.startsWith("/api/auth/")) {
      try {
        await api.refresh();
        const retryRes = await fetch(url, config);
        const retryText = await retryRes.text();
        let retryJson = null;
        if (retryText) {
          try {
            retryJson = JSON.parse(retryText);
          } catch {
            retryJson = { message: retryText };
          }
        }
        if (retryRes.ok) {
          return retryJson;
        }
        resJson = retryJson;
        response = retryRes;
      } catch {
        // Refresh attempt failed; fall through to standard ApiError throw
      }
    }

    const message =
      (resJson && (resJson.message || resJson.error)) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status, resJson);
  }

  return resJson;
}

async function uploadRequest(endpoint, files, { query } = {}) {
  let url = `${API_BASE_URL}${endpoint}`;
  if (query) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      usp.set(k, String(v));
    }
    const qs = usp.toString();
    if (qs) url += `?${qs}`;
  }

  const formData = new FormData();
  for (const file of files) formData.append("files", file);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" }, // no Content-Type — browser sets multipart boundary
      body: formData,
    });
  } catch {
    throw new ApiError(
      `Can't reach the server. Is the backend running on ${API_BASE_URL}?`,
      0,
      null,
    );
  }

  const text = await response.text();
  let resJson = null;
  if (text) {
    try {
      resJson = JSON.parse(text);
    } catch {
      resJson = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      (resJson && (resJson.message || resJson.error)) ||
      `Upload failed (${response.status})`;
    throw new ApiError(message, response.status, resJson);
  }

  return resJson;
}

export const api = {
  health: () => request("/health"),

  // --- Auth ---
  registerSchool: (payload) =>
    request("/api/auth/register-school", { method: "POST", body: payload }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload }),
  me: () => request("/api/auth/me"),
  refresh: () => request("/api/auth/refresh", { method: "POST" }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  forgotPassword: (payload) =>
    request("/api/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (payload) =>
    request("/api/auth/reset-password", { method: "POST", body: payload }),
  changePassword: (payload) =>
    request("/api/auth/change-password", { method: "POST", body: payload }),
  // The verify-email endpoint is GET ?id=&token=. The backend sets the auth
  // cookies on a successful verify and auto-signs the user in.
  verifyEmail: ({ id, token }) =>
    request("/api/auth/verify-email", { query: { id, token } }),

  // --- School: Teachers ---
  createTeacher: (payload) =>
    request("/api/school/teachers", { method: "POST", body: payload }),
  getTeachers: (params) =>
    request("/api/school/teachers", { query: params || {} }),
  updateTeacher: (slug, patch) =>
    request(`/api/school/teachers/${slug}`, { method: "PATCH", body: patch }),
  deleteTeacher: (slug) =>
    request(`/api/school/teachers/${slug}`, { method: "DELETE" }),

  // --- School: Students ---
  createStudent: (payload) =>
    request("/api/school/students", { method: "POST", body: payload }),
  getStudents: (params) =>
    request("/api/school/students", { query: params || {} }),
  updateStudent: (slug, patch) =>
    request(`/api/school/students/${slug}`, { method: "PATCH", body: patch }),
  deleteStudent: (slug) =>
    request(`/api/school/students/${slug}`, { method: "DELETE" }),

  // --- School: Staff (non-teaching: lab assistant, librarian, cashier, etc.) ---
  createStaff: (payload) =>
    request("/api/school/staff", { method: "POST", body: payload }),
  getStaff: (params) =>
    request("/api/school/staff", { query: params || {} }),
  updateStaff: (slug, patch) =>
    request(`/api/school/staff/${slug}`, { method: "PATCH", body: patch }),
  deleteStaff: (slug) =>
    request(`/api/school/staff/${slug}`, { method: "DELETE" }),

    // --- School profile ---
  getSchoolProfile: () => request("/api/school/profile"),
  updateSchoolProfile: (patch) =>
    request("/api/school/profile", { method: "PATCH", body: patch }),
  
  // --- School: Events ---
  getEvents: (params) => request("/api/school/events", { query: params || {} }),
  createEvent: (payload) =>
    request("/api/school/events", { method: "POST", body: payload }),
  updateEvent: (id, patch) =>
    request(`/api/school/events/${id}`, { method: "PATCH", body: patch }),
  deleteEvent: (id) =>
    request(`/api/school/events/${id}`, { method: "DELETE" }),

  // --- School: Sections (Class 10 - Section A, etc.) ---
  createSection: (payload) =>
    request("/api/school/sections", { method: "POST", body: payload }),
  getSections: (params) =>
    request("/api/school/sections", { query: params || {} }),
  getSection: (slug) => request(`/api/school/sections/${slug}`),
  updateSection: (slug, patch) =>
    request(`/api/school/sections/${slug}`, { method: "PATCH", body: patch }),
  deleteSection: (slug) =>
    request(`/api/school/sections/${slug}`, { method: "DELETE" }),

  // --- School: Teacher-to-class-subject assignments ---
  // "Allocate Teacher to Class" form.
  createAssignment: (payload) =>
    request("/api/school/assignments", { method: "POST", body: payload }),
  getAssignments: (params) =>
    request("/api/school/assignments", { query: params || {} }),
  updateAssignment: (id, patch) =>
    request(`/api/school/assignments/${id}`, { method: "PATCH", body: patch }),
  deleteAssignment: (id) =>
    request(`/api/school/assignments/${id}`, { method: "DELETE" }),

  // --- School: Academic Structure wings ---
  createWing: (payload) =>
    request("/api/school/wings", { method: "POST", body: payload }),
  getWings: () => request("/api/school/wings"),
  updateWing: (slug, patch) =>
    request(`/api/school/wings/${slug}`, { method: "PATCH", body: patch }),
  deleteWing: (slug) =>
    request(`/api/school/wings/${slug}`, { method: "DELETE" }),
  reorderWings: (orderedIds) =>
    request("/api/school/wings/reorder", {
      method: "POST",
      body: { orderedIds },
    }),

  getTeacherTimetable: (teacherId) =>
    request(`/api/school/timetable/teacher/${teacherId}`),

  getSectionTimetable: (sectionId) =>
    request(`/api/school/timetable/section/${sectionId}`),

  upsertPrincipalTimetableSlot: (data) =>
    request(`/api/school/timetable/slots`, {
      method: "POST",
      body: data,
    }),

  deletePrincipalTimetableSlot: (id) =>
    request(`/api/school/timetable/slots/${id}`, {
      method: "DELETE",
    }),
  // --- Teacher: self-service ---
  getMyAssignments: () => request("/api/teacher/my-assignments"),

  // --- Teacher: attendance marking ---
  getAttendanceRoster: (params) =>
    request("/api/teacher/attendance/roster", { query: params }),
  markAttendance: (payload) =>
    request("/api/teacher/attendance/mark", { method: "POST", body: payload }),

  // --- Attendance: shared reads (STUDENT self / TEACHER / SCHOOL) ---
  getMyAttendance: (params) =>
    request("/api/attendance/mine", { query: params || {} }),
  getStudentAttendanceHistory: (studentSlug, params) =>
    request(`/api/attendance/student/${studentSlug}`, { query: params || {} }),
  getMyTodaySummaries: () => request("/api/attendance/today-summaries"),
  // TODO(backend): not implemented yet. Expected response shape:
  //   { data: { week: [{ label: "Mon", present, absent }, ...] } }
  // Student's own Mon-Sat attendance breakdown for the current week.
  getMyAttendanceWeek: (params) =>
    request("/api/attendance/mine/week", { query: params || {} }),
  // TODO(backend): not implemented yet. Expected response shape:
  //   { data: { week: [{ label: "Mon", present, absent }, ...] } }
  // Teacher's Mon-Sat present/absent totals summed across their sections.
  getMyWeeklySummaries: (params) =>
    request("/api/attendance/today-summaries/week", { query: params || {} }),
  getSectionAttendanceSummary: (params) =>
    request("/api/attendance/section-summary", { query: params }),
  getSchoolAttendanceTrend: (params) =>
    request("/api/attendance/school-trend", { query: params || {} }),
  getSchoolStats: () => request("/api/attendance/school-stats"),

  // --- Leave requests ---
  applyForLeave: (payload) =>
    request("/api/leave", { method: "POST", body: payload }),
  getMyLeaves: () => request("/api/leave/mine"),
  getLeaveInbox: (params) =>
    request("/api/leave/inbox", { query: params || {} }),
  approveLeave: (slug, reviewerNote) =>
    request(`/api/leave/${slug}/approve`, {
      method: "PATCH",
      body: { reviewerNote: reviewerNote || "" },
    }),
  denyLeave: (slug, reviewerNote) =>
    request(`/api/leave/${slug}/deny`, {
      method: "PATCH",
      body: { reviewerNote: reviewerNote || "" },
    }),

  // --- File uploads (Cloudinary-backed) ---
  // purpose: "assignment" (default) or "submission" — routes to a different
  // Cloudinary folder server-side. Returns [{name, url, size, type}, ...].
  uploadFiles: (files, purpose = "assignment") =>
    uploadRequest("/api/uploads", files, { query: { purpose } }),

  // --- Homework / Assignments: Teacher ---
  createHomeworkAssignment: (payload) =>
    request("/api/teacher/assignments", { method: "POST", body: payload }),
  getMyCreatedAssignments: () => request("/api/teacher/assignments"),
  gradeSubmission: (assignmentSlug, studentSlug, payload) =>
    request(
      `/api/teacher/assignments/${assignmentSlug}/submissions/${studentSlug}/grade`,
      {
        method: "PATCH",
        body: payload,
      },
    ),

  // --- Homework / Assignments: Student ---
  getMyVisibleAssignments: () => request("/api/student/assignments"),
  submitHomeworkAssignment: (slug, payload) =>
    request(`/api/student/assignments/${slug}/submit`, {
      method: "POST",
      body: payload,
    }),

  // --- Homework / Assignments: shared detail ---
  getAssignmentDetail: (slug) => request(`/api/assignments/${slug}`),

  // --- Teacher: Timetable / Schedule ---
  getMyTeacherSchedule: () => request("/api/teacher/schedule"),
  upsertTimetableSlot: (payload) =>
    request("/api/teacher/schedule/slots", { method: "POST", body: payload }),
  deleteTimetableSlot: (id) =>
    request(`/api/teacher/schedule/slots/${id}`, { method: "DELETE" }),

  // --- Student: Timetable ---
  getMyStudentTimetable: () => request("/api/student/timetable"),

  // --- Teacher: Syllabus ---
  upsertSyllabusProgress: (payload) =>
    request("/api/teacher/syllabus", { method: "POST", body: payload }),
  getMyTeacherSyllabus: () => request("/api/teacher/syllabus"),

  // --- Student: Syllabus ---
  getMyStudentSyllabus: () => request("/api/student/syllabus"),

  // --- Teacher: Study Materials ---
  createStudyMaterial: (payload) =>
    request("/api/teacher/materials", { method: "POST", body: payload }),
  getMyTeacherMaterials: () => request("/api/teacher/materials"),
  deleteStudyMaterial: (slug) =>
    request(`/api/teacher/materials/${slug}`, { method: "DELETE" }),

  // --- Student: Study Materials ---
  getMyStudentMaterials: () => request("/api/student/materials"),

  // --- Student: Study Diary (personal, self-only) ---
  createDiaryEntry: (payload) =>
    request("/api/student/diary", { method: "POST", body: payload }),
  getMyDiaryEntries: () => request("/api/student/diary"),
  deleteDiaryEntry: (id) =>
    request(`/api/student/diary/${id}`, { method: "DELETE" }),

  // --- Fees: Principal / Teacher (school-scoped) ---
  getSchoolFeeClasses: () => request("/api/school/fees/classes"),
  getFeeStructures: (params) =>
    request("/api/school/fees/structures", { query: params || {} }),
  upsertFeeStructure: (payload) =>
    request("/api/school/fees/structures", { method: "POST", body: payload }),
  bulkAssignFee: (payload) =>
    request("/api/school/fees/structures/assign-bulk", {
      method: "POST",
      body: payload,
    }),
  getSchoolFeeStudents: (params) =>
    request("/api/school/fees/students", { query: params || {} }),
  getSchoolFeeStats: (params) =>
    request("/api/school/fees/stats", { query: params || {} }),
  getStudentFeeDetail: (slug, params) =>
    request(`/api/school/fees/students/${slug}`, { query: params || {} }),
  assignStudentFee: (slug, payload) =>
    request(`/api/school/fees/students/${slug}/assign`, {
      method: "POST",
      body: payload,
    }),
  recordStudentPayment: (slug, payload) =>
    request(`/api/school/fees/students/${slug}/payments`, {
      method: "POST",
      body: payload,
    }),

  // --- Fees: Student self-service ---
  getMyFee: (params) => request("/api/student/fees/me", { query: params || {} }),
  getMyFeePayments: () => request("/api/student/fees/me/payments"),
};
