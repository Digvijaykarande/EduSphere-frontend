"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

async function apiGet(path, params) {
  const url = new URL(`${BASE}${path}`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString(), { credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  return json.data;
}

export const useAttendanceStore = create((set, get) => ({
  // --- Student self-service ---
  studentHistory: null,
  isLoadingStudentHistory: false,

  fetchMyAttendance: async (params) => {
    set({ isLoadingStudentHistory: true });
    try {
      const data = await apiGet("/attendance/mine", params);
      set({ studentHistory: data, isLoadingStudentHistory: false });
      return data;
    } catch (err) {
      set({ isLoadingStudentHistory: false });
      throw err;
    }
  },

  // --- Any role: history for a specific student by slug ---
  selectedStudentHistory: null,
  isLoadingSelectedStudentHistory: false,

  fetchStudentHistory: async (slug, params) => {
    set({ isLoadingSelectedStudentHistory: true });
    try {
      const data = await apiGet(`/attendance/student/${slug}`, params);
      set({ selectedStudentHistory: data, isLoadingSelectedStudentHistory: false });
      return data;
    } catch (err) {
      set({ isLoadingSelectedStudentHistory: false });
      throw err;
    }
  },

  clearSelectedStudentHistory: () => set({ selectedStudentHistory: null }),

  // --- Principal: school-wide ---
  schoolTrend: null,
  fetchSchoolTrend: async (params) => {
    const data = await apiGet("/attendance/school-trend", params);
    set({ schoolTrend: data.trend ?? data });
    return data;
  },

  schoolStats: null,
  fetchSchoolStats: async () => {
    const data = await apiGet("/attendance/school-stats");
    set({ schoolStats: data });
    return data;
  },

  // --- Principal: sections directory ---
  sections: [],
  isLoadingSections: false,
  fetchSchoolSections: async () => {
    set({ isLoadingSections: true });
    try {
      const data = await apiGet("/attendance/sections");
      set({ sections: data.sections ?? [], isLoadingSections: false });
      return data.sections;
    } catch (err) {
      set({ isLoadingSections: false });
      throw err;
    }
  },

  // --- Principal + Teacher: roster for one section ---
  sectionRoster: null,
  isLoadingSectionRoster: false,
  fetchSectionRoster: async (sectionId) => {
    set({ isLoadingSectionRoster: true });
    try {
      const data = await apiGet(`/attendance/sections/${sectionId}/roster`);
      set({ sectionRoster: data, isLoadingSectionRoster: false });
      return data;
    } catch (err) {
      set({ isLoadingSectionRoster: false });
      throw err;
    }
  },
  clearSectionRoster: () => set({ sectionRoster: null }),

  // --- Teacher: their own sections + today's per-section summary ---
  myTodaySummaries: [],
  fetchMyTodaySummaries: async () => {
    const data = await apiGet("/attendance/today-summaries");
    set({ myTodaySummaries: data.summaries ?? [] });
    return data.summaries;
  },

  // --- Shared: section-day summary for a specific date ---
  sectionDaySummary: null,
  fetchSectionDaySummary: async (sectionId, date) => {
    const data = await apiGet("/attendance/section-summary", { sectionId, date });
    set({ sectionDaySummary: data });
    return data;
  },

  // --- Teacher: attendance marking (assignments → roster → save) ---
  // Backs TeacherTakeAttendance. Uses the shared `api` client (not the local
  // apiGet helper) so it reuses the exact /api/teacher endpoints and cookie
  // handling. Endpoints are TEACHER-only server-side.
  myAssignments: [],
  assignmentsLoading: true, // start true so the first paint shows a loader,
  // not the "you have no classes" empty state, before fetchMyAssignments runs.
  fetchMyAssignments: async () => {
    set({ assignmentsLoading: true });
    try {
      const res = await api.getMyAssignments();
      const assignments = res?.data?.assignments ?? [];
      set({ myAssignments: assignments, assignmentsLoading: false });
      return assignments;
    } catch (err) {
      set({ myAssignments: [], assignmentsLoading: false });
      throw err;
    }
  },

  // Roster for the currently-selected slot. `rosterSlot` is remembered here so
  // saveRoster() can be called with no args (the component keeps section/
  // subject/period/date in local state and only passes them via fetchRoster).
  roster: [],
  rosterLoading: false,
  rosterError: null,
  rosterSlot: null,
  fetchRoster: async ({ sectionId, subject, period, date }) => {
    set({ rosterLoading: true, rosterError: null });
    try {
      const res = await api.getAttendanceRoster({ sectionId, subject, period, date });
      const roster = res?.data?.roster ?? [];
      set({
        roster,
        rosterSlot: { sectionId, subject, period, date },
        rosterLoading: false,
      });
      return roster;
    } catch (err) {
      set({
        roster: [],
        rosterLoading: false,
        rosterError: err?.message || "Failed to load roster.",
      });
    }
  },

  setLocalStatus: (studentId, status) =>
    set((state) => ({
      roster: state.roster.map((r) =>
        r.studentId === studentId ? { ...r, status } : r,
      ),
    })),

  setAllLocalStatus: (status) =>
    set((state) => ({
      roster: state.roster.map((r) => ({ ...r, status })),
    })),

  saving: false,
  saveRoster: async () => {
    const { roster, rosterSlot } = get();
    if (!rosterSlot) {
      return { success: false, message: "No section selected." };
    }
    // Only persist students who were actually marked. "not-marked" rows are
    // excluded so they don't inflate the denominator of each student's
    // term-to-date attendance % (the backend counts every stored row).
    const marks = roster
      .filter((r) => r.status && r.status !== "not-marked")
      .map((r) => ({ studentId: r.studentId, status: r.status }));
    if (marks.length === 0) {
      return { success: false, message: "Mark at least one student before saving." };
    }
    set({ saving: true });
    try {
      await api.markAttendance({ ...rosterSlot, marks });
      set({ saving: false });
      return { success: true };
    } catch (err) {
      set({ saving: false });
      return { success: false, message: err?.message || "Failed to save attendance." };
    }
  },
}));
