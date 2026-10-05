import { create } from "zustand";
import { api, ApiError } from "@/lib/api";

const errorMessage = (err, fallback) =>
  err instanceof ApiError ? err.message : fallback;

// Adapts a backend LeaveRequest doc to the shape the existing components
// (LeaveInbox, LeaveApplicationsPanel, StudentAttendanceView) already expect:
// { id, name, section, from, to, reason, status }. Keeping this mapping in
// one place means the UI components didn't need to be rewritten.
function normalizeLeave(doc) {
  if (!doc) return doc;
  const statusLabel =
    doc.status === "APPROVED" ? "Approved" : doc.status === "DENIED" ? "Denied" : "Pending";
  return {
    id: doc.slug,
    slug: doc.slug,
    name: doc.applicantUserId?.name || doc.applicantUserId?.email || "Unknown",
    section: doc.sectionId?.gradeClass
      ? `${doc.sectionId.gradeClass} - ${doc.sectionId.section}`
      : undefined,
    from: doc.fromDate ? doc.fromDate.slice(0, 10) : "",
    to: doc.toDate ? doc.toDate.slice(0, 10) : "",
    reason: doc.reason,
    status: statusLabel,
    reviewerNote: doc.reviewerNote || "",
  };
}

export const useLeaveStore = create((set, get) => ({
  // Own leave history (for the currently logged-in student or teacher).
  myLeaves: [],
  myLeavesLoading: false,

  // Approval inbox — student leaves (for a class teacher) or teacher leaves
  // (for the school). Same shape either way: { id, status, ... }.
  inbox: [],
  inboxLoading: false,
  inboxError: null,

  submitting: false,
  submitError: null,

  fetchMyLeaves: async () => {
    set({ myLeavesLoading: true });
    try {
      const res = await api.getMyLeaves();
      set({
        myLeaves: (res.data?.leaves || []).map(normalizeLeave),
        myLeavesLoading: false,
      });
      return { success: true };
    } catch (err) {
      set({ myLeavesLoading: false });
      return { success: false, error: errorMessage(err, "Failed to load leave history.") };
    }
  },

  // Matches the shape LeaveApplyForm/StudentLeaveForm already call onSubmit
  // with: { from, to, reason, ...meta }. Backend expects fromDate/toDate.
  submitLeave: async ({ from, to, reason }) => {
    set({ submitting: true, submitError: null });
    try {
      const res = await api.applyForLeave({ fromDate: from, toDate: to, reason });
      const leave = normalizeLeave(res.data?.leave);
      set((s) => ({
        myLeaves: leave ? [leave, ...s.myLeaves] : s.myLeaves,
        submitting: false,
      }));
      return { success: true, leave };
    } catch (err) {
      const message = errorMessage(err, "Failed to submit leave application.");
      set({ submitting: false, submitError: message });
      return { success: false, error: message };
    }
  },

  fetchInbox: async (params) => {
    set({ inboxLoading: true, inboxError: null });
    try {
      const res = await api.getLeaveInbox(params);
      set({
        inbox: (res.data?.leaves || []).map(normalizeLeave),
        inboxLoading: false,
      });
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, "Failed to load leave requests.");
      set({ inboxLoading: false, inboxError: message });
      return { success: false, error: message };
    }
  },

  approveLeave: async (slug, reviewerNote) => {
    try {
      await api.approveLeave(slug, reviewerNote);
      set((s) => ({ inbox: s.inbox.filter((r) => r.slug !== slug) }));
      return { success: true };
    } catch (err) {
      return { success: false, error: errorMessage(err, "Failed to approve leave.") };
    }
  },

  denyLeave: async (slug, reviewerNote) => {
    try {
      await api.denyLeave(slug, reviewerNote);
      set((s) => ({ inbox: s.inbox.filter((r) => r.slug !== slug) }));
      return { success: true };
    } catch (err) {
      return { success: false, error: errorMessage(err, "Failed to deny leave.") };
    }
  },
}));
