"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Users, Eye, School, Search, GraduationCap } from "lucide-react";
import { useAttendanceStore } from "@/store/useAttendanceStore";
import StudentHistoryModal from "./StudentHistoryModal";

const PAGE_SIZE = 10;

function pctColor(pct) {
  if (pct >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function pctBarColor(pct) {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-rose-500";
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Deterministic soft avatar color from the student's name, so each row reads
// distinctly without random re-renders shuffling colors.
const AVATAR_PALETTE = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
];
function avatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[Math.abs(hash)];
}

/**
 * Class/section-wise attendance browser. `sections` is the list to render
 * (Principal passes every school section; Teacher passes only their own
 * assigned sections). Clicking a section loads its live roster with each
 * student's term-to-date attendance %; clicking a student opens their full
 * history.
 */
export default function SectionRosterBrowser({ sections, isLoading }) {
  const sectionRoster = useAttendanceStore((s) => s.sectionRoster);
  const isLoadingRoster = useAttendanceStore((s) => s.isLoadingSectionRoster);
  const fetchSectionRoster = useAttendanceStore((s) => s.fetchSectionRoster);
  const clearSectionRoster = useAttendanceStore((s) => s.clearSectionRoster);

  const [activeSectionId, setActiveSectionId] = useState(null);
  const [selectedStudentSlug, setSelectedStudentSlug] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeSectionId) fetchSectionRoster(activeSectionId);
    return () => clearSectionRoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionId]);

  useEffect(() => {
    setPage(1);
  }, [query, activeSectionId]);

  const roster = sectionRoster?.roster || [];
  const section = sectionRoster?.section;

  const filteredRoster = useMemo(() => {
    if (!query.trim()) return roster;
    const q = query.trim().toLowerCase();
    return roster.filter(
      (s) => s.name.toLowerCase().includes(q) || String(s.rollNumber).toLowerCase().includes(q)
    );
  }, [roster, query]);

  const totalPages = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const pagedRoster = filteredRoster.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // --- Roster view for one section ---
  if (activeSectionId) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-white to-white dark:from-indigo-500/10 dark:via-slate-900 dark:to-slate-900">
          <button
            onClick={() => setActiveSectionId(null)}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-500 transition-colors shrink-0"
            aria-label="Back to sections"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {section ? `${section.gradeClass}${section.section}` : "—"}
          </div>

          <div className="min-w-0 mr-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {section ? `${section.gradeClass} - ${section.section}` : "Loading…"}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {roster.length} student{roster.length !== 1 ? "s" : ""} · term-to-date attendance
            </p>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or roll no."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoadingRoster ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading roster…</div>
          ) : filteredRoster.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              {roster.length === 0 ? "No active students in this section." : "No students match your search."}
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {pagedRoster.map((s) => (
                  <tr
                    key={s.studentId}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedStudentSlug(s.slug)}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${avatarColor(
                            s.name
                          )}`}
                        >
                          {initials(s.name)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {s.rollNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pctBarColor(s.overallAttendancePct)}`}
                            style={{ width: `${Math.min(100, Math.max(0, s.overallAttendancePct))}%` }}
                          />
                        </div>
                        <span className={`font-bold text-xs tabular-nums ${pctColor(s.overallAttendancePct)}`}>
                          {s.overallAttendancePct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentSlug(s.slug);
                        }}
                        className="inline-flex items-center gap-1.5 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filteredRoster.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-700 dark:text-slate-300">{(page - 1) * PAGE_SIZE + 1}
              –{Math.min(page * PAGE_SIZE, filteredRoster.length)}</span> of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">{filteredRoster.length}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-1.5 tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {selectedStudentSlug && (
          <StudentHistoryModal slug={selectedStudentSlug} onClose={() => setSelectedStudentSlug(null)} />
        )}
      </div>
    );
  }

  // --- Section list ---
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-white to-white dark:from-indigo-500/10 dark:via-slate-900 dark:to-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <School size={16} className="text-indigo-500" /> Class & Section Attendance
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Select a section to view its roster and student-wise attendance
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-slate-400">Loading sections…</div>
      ) : sections.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400">No sections found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          {sections.map((sec) => (
            <button
              key={sec.sectionId}
              onClick={() => setActiveSectionId(sec.sectionId)}
              className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-100/60 dark:hover:shadow-none bg-white dark:bg-slate-800/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 group-hover:scale-125 transition-transform" />

              <div className="relative flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {sec.gradeClass}
                  {sec.section}
                </div>
                <Users size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>

              <div className="relative">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {sec.gradeClass} - {sec.section}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {sec.totalStudents} students
                  {sec.classTeacher ? ` · ${sec.classTeacher}` : ""}
                </p>
              </div>

              {sec.today && (
                <div className="relative flex items-center gap-2 text-[10px] font-bold mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {sec.today.present} Present
                  </span>
                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {sec.today.absent} Absent
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> {sec.today.notMarked} Unmarked
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}