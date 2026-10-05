"use client";

import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

async function apiGet(path, params) {
  const url = new URL(
    `${BASE}${path}`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost",
  );
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

async function apiSend(method, path, body) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  return json.data;
}

const apiPost = (path, body) => apiSend("POST", path, body);
const apiPatch = (path, body) => apiSend("PATCH", path, body);
const apiDelete = (path) => apiSend("DELETE", path);

export const useExamStore = create((set, get) => ({
  // --- Exams list (All Exams / Schedule) ---
  exams: [],
  examsPagination: null,
  isLoadingExams: false,

  fetchExams: async (params) => {
    set({ isLoadingExams: true });
    try {
      const data = await apiGet("/exams", params);
      set({
        exams: data.exams ?? [],
        examsPagination: data.pagination ?? null,
        isLoadingExams: false,
      });
      return data;
    } catch (err) {
      set({ isLoadingExams: false });
      throw err;
    }
  },

  createExam: async (payload) => {
    const data = await apiPost("/exams", payload);
    // Optimistically prepend so All Exams / Schedule feel instant; a
    // subsequent fetchExams() call (e.g. on tab focus) will reconcile.
    set((state) => ({ exams: [data.exam, ...state.exams] }));
    return data.exam;
  },

  updateExam: async (idOrSlug, patch) => {
    const data = await apiPatch(`/exams/${idOrSlug}`, patch);
    set((state) => ({
      exams: state.exams.map((e) =>
        e.slug === idOrSlug || e._id === idOrSlug ? data.exam : e,
      ),
    }));
    return data.exam;
  },

  deleteExam: async (idOrSlug) => {
    await apiDelete(`/exams/${idOrSlug}`);
    set((state) => ({
      exams: state.exams.filter(
        (e) => e.slug !== idOrSlug && e._id !== idOrSlug,
      ),
    }));
  },

  // --- Principal Overview widgets ---
  stats: null,
  isLoadingStats: false,
  fetchStats: async () => {
    set({ isLoadingStats: true });
    try {
      const data = await apiGet("/exams/stats");
      set({ stats: data.stats, isLoadingStats: false });
      return data.stats;
    } catch (err) {
      set({ isLoadingStats: false });
      throw err;
    }
  },

  upcomingExams: [],
  fetchUpcomingExams: async () => {
    const data = await apiGet("/exams/upcoming");
    set({ upcomingExams: data.upcomingExams ?? [] });
    return data.upcomingExams;
  },

  recentResults: [],
  fetchRecentResults: async () => {
    const data = await apiGet("/exams/recent-results");
    set({ recentResults: data.recentResults ?? [] });
    return data.recentResults;
  },

  topPerformers: [],
  fetchTopPerformers: async () => {
    const data = await apiGet("/exams/top-performers");
    set({ topPerformers: data.topPerformers ?? [] });
    return data.topPerformers;
  },

  // --- Analytics ---
  analytics: null,
  isLoadingAnalytics: false,
  fetchAnalytics: async () => {
    set({ isLoadingAnalytics: true });
    try {
      const data = await apiGet("/exams/analytics");
      set({ analytics: data.analytics, isLoadingAnalytics: false });
      return data.analytics;
    } catch (err) {
      set({ isLoadingAnalytics: false });
      throw err;
    }
  },

  // --- Gradebook (per-exam marks entry) ---
  gradebook: null,
  isLoadingGradebook: false,
  fetchGradebook: async (examId, params) => {
    set({ isLoadingGradebook: true });
    try {
      const data = await apiGet(`/exams/${examId}/gradebook`, params);
      set({ gradebook: data, isLoadingGradebook: false });
      return data;
    } catch (err) {
      set({ isLoadingGradebook: false });
      throw err;
    }
  },
  clearGradebook: () => set({ gradebook: null }),

  saveMarks: async (examId, entries) => {
    // entries: [{ studentId, marksObtained }]
    return apiPost(`/exams/${examId}/marks`, { entries });
  },

  // --- Results pipeline ---
  resultsQueue: [],
  isLoadingResultsQueue: false,
  fetchResultsQueue: async () => {
    set({ isLoadingResultsQueue: true });
    try {
      const data = await apiGet("/exams/results-queue");
      set({ resultsQueue: data.queue ?? [], isLoadingResultsQueue: false });
      return data.queue;
    } catch (err) {
      set({ isLoadingResultsQueue: false });
      throw err;
    }
  },

  publishResults: async (idOrSlug) => {
    const data = await apiPatch(`/exams/${idOrSlug}/publish`);
    set((state) => ({
      resultsQueue: state.resultsQueue.map((r) =>
        r.id === idOrSlug ? { ...r, status: "Published" } : r,
      ),
    }));
    return data.exam;
  },

  // --- Student self-service ---
  studentOverview: null,
  isLoadingStudentOverview: false,
  fetchStudentOverview: async () => {
    set({ isLoadingStudentOverview: true });
    try {
      const data = await apiGet("/exams/student/overview");
      set({ studentOverview: data, isLoadingStudentOverview: false });
      return data;
    } catch (err) {
      set({ isLoadingStudentOverview: false });
      throw err;
    }
  },
}));
