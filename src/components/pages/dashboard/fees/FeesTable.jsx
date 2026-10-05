// src/components/pages/dashboard/fees/FeesTable.jsx
"use client";

import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { StudentAvatar, StatusBadge } from "./shared";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FeesTable({ students, onSelectStudent, isProfileOpen }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col h-full">
      {/* Changed padding to tighten spacing between columns */}
      <Table className="text-left text-sm whitespace-nowrap">
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
          <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
            <TableHead className="py-4 px-4 h-auto">Student Name</TableHead>
            <TableHead className="py-4 px-3 h-auto">Class</TableHead>
            <TableHead className="py-4 px-3 h-auto">Total Fees</TableHead>
            <TableHead className="py-4 px-3 h-auto">Paid Amount</TableHead>
            <TableHead className="py-4 px-3 h-auto">Pending</TableHead>
            <TableHead className="py-4 px-3 h-auto">Status</TableHead>

            {!isProfileOpen && (
              <TableHead className="py-4 px-4 h-auto text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
          {paginatedStudents.map((s) => (
            <TableRow
              key={s.id}
              className="border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
              onClick={() => onSelectStudent(s)}
            >
              <TableCell className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <StudentAvatar name={s.name} src={s.avatar} />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Roll No: {s.rollNo}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3 px-3 font-semibold text-xs">{s.class}</TableCell>
              <TableCell className="py-3 px-3 font-mono text-xs font-medium">₹{s.totalFees.toLocaleString()}</TableCell>
              <TableCell className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                ₹{s.paidAmount.toLocaleString()}
              </TableCell>
              <TableCell className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">
                ₹{s.pendingAmount.toLocaleString()}
              </TableCell>
              <TableCell className="py-3 px-3">
                <StatusBadge status={s.status} />
              </TableCell>

              {!isProfileOpen && (
                <TableCell className="py-3 px-4 text-right">
                  {/* Removed hover opacity classes to make it always visible */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(s);
                    }}
                    className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white text-[11px] font-bold px-3 py-1.5 h-auto rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}

          {students.length === 0 && (
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableCell colSpan={isProfileOpen ? 6 : 7} className="py-12 text-center text-slate-500 text-sm font-medium">
                No students found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 mt-auto">
        <span className="text-xs text-slate-500 font-medium">
          Showing {students.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, students.length)} of {students.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-1.5 h-auto rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors bg-transparent"
          >
            <ChevronLeft size={16} />
          </Button>
          <Badge
            variant="outline"
            className="text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-900 dark:text-white"
          >
            {currentPage} / {totalPages}
          </Badge>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-1.5 h-auto rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors bg-transparent"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}