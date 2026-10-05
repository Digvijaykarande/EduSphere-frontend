"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useLeaveStore } from "@/store/use-leave-store";
import TeacherTakeAttendance from "./Teachertakeattendance";
import LeaveInbox from "./Leaveinbox";
import LeaveApplyForm from "./Leaveapplyform";
import SectionRosterBrowser from "./SectionRosterBrowser";

const TABS = ["Take Attendance", "View Attendance", "Student Leave Requests", "Apply Leave"];

export default function TeacherAttendancePage() {
  const [tab, setTab] = useState(TABS[0]);
  const user = useAuthStore((s) => s.user);

  const inbox = useLeaveStore((s) => s.inbox);
  const fetchInbox = useLeaveStore((s) => s.fetchInbox);
  const approveLeave = useLeaveStore((s) => s.approveLeave);
  const denyLeave = useLeaveStore((s) => s.denyLeave);

  const myLeaves = useLeaveStore((s) => s.myLeaves);
  const fetchMyLeaves = useLeaveStore((s) => s.fetchMyLeaves);
  const submitLeave = useLeaveStore((s) => s.submitLeave);

  // Teacher's own sections (from TeacherAssignment), deduped — used to scope
  // the "View Attendance" tab so a teacher only browses classes they teach.
  const [mySections, setMySections] = useState([]);
  const [isLoadingMySections, setIsLoadingMySections] = useState(false);

  useEffect(() => {
    if (user && tab === "Student Leave Requests") fetchInbox();
  }, [user, tab, fetchInbox]);

  useEffect(() => {
    if (user && tab === "Apply Leave") fetchMyLeaves();
  }, [user, tab, fetchMyLeaves]);

  useEffect(() => {
    if (!user || tab !== "View Attendance") return;
    setIsLoadingMySections(true);
    const base = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "/api";
    fetch(`${base}/teacher/my-assignments`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const assignments = json?.data?.assignments || [];
        // One TeacherAssignment row per (teacher, section); dedupe by
        // section since the roster browser is section-scoped, not subject-scoped.
        const seen = new Map();
        for (const a of assignments) {
          const sec = a.sectionId;
          if (sec && !seen.has(String(sec._id))) {
            seen.set(String(sec._id), {
              sectionId: sec._id,
              gradeClass: sec.gradeClass,
              section: sec.section,
              totalStudents: null,
              today: null,
            });
          }
        }
        setMySections(Array.from(seen.values()));
      })
      .finally(() => setIsLoadingMySections(false));
  }, [user, tab]);

  if (!user) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  async function handleSubmitLeave(payload) {
    await submitLeave(payload);
  }

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Updated to allow smooth horizontal scrolling on mobile instead of forcing w-max */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit-content overflow-x-auto no-scrollbar" style={{flexWrap:"wrap",width:"fit-content"}} 
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              tab === t ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Take Attendance" && <TeacherTakeAttendance />}
      {tab === "View Attendance" && (
        <SectionRosterBrowser sections={mySections} isLoading={isLoadingMySections} />
      )}
      {tab === "Student Leave Requests" && (
        <LeaveInbox
          title="Student Leave Requests"
          subtitle="Pending approvals from your class"
          requests={inbox}
          onApprove={(id) => approveLeave(id)}
          onDeny={(id) => denyLeave(id)}
        />
      )}

      {tab === "Apply Leave" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <LeaveApplyForm
              applicantName={user.name}
              applicantMeta={{ role: "Teacher" }}
              submittedTo="the Principal"
              onSubmit={handleSubmitLeave}
            />
          </div>
          <div className="dashboard-card p-5">
            <p className="text-sm font-display font-semibold text-foreground mb-3">My Requests</p>
            <div className="space-y-2.5">
              {myLeaves.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">No leave requests yet.</p>}
              {myLeaves.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-xs gap-2">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {r.from}{r.to !== r.from ? ` – ${r.to}` : ""}
                  </span>
                  <span
                    className={`shrink-0 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      r.status === "Approved"
                        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : r.status === "Denied"
                        ? "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300"
                        : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
