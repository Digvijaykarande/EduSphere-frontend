"use client";

import React, { useEffect, useMemo, useState } from "react";
import AttendanceToolbar from "./Attendancetoolbar";
import BulkActionsBar from "./Bulkactionsbar";
import SeatGrid from "./Seatgrid";
import AttendanceSummaryPanel from "./Attendancesummarypanel";
import { useAttendanceStore } from "@/store/useAttendanceStore";
import { PERIODS } from "@/store/attendance.utils";

export default function TeacherTakeAttendance() {
  const {
    myAssignments,
    assignmentsLoading,
    fetchMyAssignments,
    roster,
    rosterLoading,
    rosterError,
    fetchRoster,
    setLocalStatus,
    setAllLocalStatus,
    saveRoster,
    saving,
  } = useAttendanceStore();

  // Derive the unique list of sections this teacher is assigned to, and the
  // subjects available for whichever section is currently selected — both
  // come from real TeacherAssignment rows, never a hardcoded list.
  const sectionOptions = useMemo(() => {
    const seen = new Map();
    for (const a of myAssignments) {
      const sec = a.sectionId;
      if (sec && !seen.has(sec._id)) {
        seen.set(sec._id, {
          value: sec._id,
          class: sec.gradeClass,
          section: sec.section,
        });
      }
    }
    return Array.from(seen.values());
  }, [myAssignments]);

  const [sectionId, setSectionId] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState(PERIODS[0]);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const subjectOptions = useMemo(() => {
    const match = myAssignments.find((a) => a.sectionId?._id === sectionId);
    return match ? match.subjects : [];
  }, [myAssignments, sectionId]);

  useEffect(() => {
    fetchMyAssignments();
  }, [fetchMyAssignments]);

  // Once assignments load, default to the first available section/subject.
  useEffect(() => {
    if (!sectionId && sectionOptions.length > 0) {
      setSectionId(sectionOptions[0].value);
    }
  }, [sectionOptions, sectionId]);

  useEffect(() => {
    if (subjectOptions.length > 0 && !subjectOptions.includes(subject)) {
      setSubject(subjectOptions[0]);
    }
  }, [subjectOptions, subject]);

  useEffect(() => {
    if (sectionId && subject && period && date) {
      fetchRoster({ sectionId, subject, period, date });
      setSaved(false);
    }
  }, [sectionId, subject, period, date, fetchRoster]);

  function changeSection(val) {
    setSectionId(val);
    setSaved(false);
  }

  function cycleStatus(studentId) {
    const current = roster.find((r) => r.studentId === studentId)?.status || "not-marked";
    const cycle = ["not-marked", "present", "absent", "late"];
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    setLocalStatus(studentId, next);
    setSaved(false);
  }

  function markAll(status) {
    setAllLocalStatus(status);
    setSaved(false);
  }

  function clearAll() {
    setAllLocalStatus("not-marked");
    setSaved(false);
  }

  async function handleSave() {
    setSaveError("");
    const result = await saveRoster();
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError(result.message || "Failed to save attendance.");
    }
  }

  // Shape the roster for SeatGrid/AttendanceSummaryPanel, which expect
  // { id, rollNo, name, status }. `overall` is the real term-to-date
  // attendance % computed server-side (Attendance.service.computeOverallAttendancePct),
  // not mock data — SeatGrid's tooltip and any future warning-threshold UI
  // can rely on it being accurate.
  const studentsForGrid = roster.map((r) => ({
    id: r.studentId,
    rollNo: r.rollNumber,
    name: r.name,
    status: r.status,
    overall: `${r.overallAttendancePct}%`,
  }));

  if (assignmentsLoading && sectionOptions.length === 0) {
    return <p className="text-sm text-slate-500">Loading your class assignments…</p>;
  }

  if (!assignmentsLoading && sectionOptions.length === 0) {
    return (
      <div className="dashboard-card p-6 text-sm text-slate-500 dark:text-slate-400">
        You haven't been assigned to any class yet. Contact your school administrator.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AttendanceToolbar
        section={sectionId} setSection={changeSection}
        subject={subject} setSubject={setSubject}
        date={date} setDate={setDate}
        period={period} setPeriod={setPeriod}
        classOptionsOverride={sectionOptions}
        subjectOptionsOverride={subjectOptions}
      />
      {saveError && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
          {saveError}
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-2 items-start">
        <div className="space-y-4">
          <BulkActionsBar onMarkAll={markAll} onClearAll={clearAll} query={query} setQuery={setQuery} />
          <div className="dashboard-card">
            {rosterLoading ? (
              <p className="text-sm text-slate-500 p-6">Loading roster…</p>
            ) : rosterError ? (
              <p className="text-sm text-rose-500 p-6">{rosterError}</p>
            ) : (
              <SeatGrid students={studentsForGrid} onCycle={cycleStatus} query={query} />
            )}
          </div>
        </div>
        <AttendanceSummaryPanel students={studentsForGrid} onSave={handleSave} saved={saved || saving} />
      </div>
    </div>
  );
}
