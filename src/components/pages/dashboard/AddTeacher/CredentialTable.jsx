"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Users,
  GraduationCap,
  Briefcase,
  Copy,
  Check,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  FileSpreadsheet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { api, ApiError } from "@/lib/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Pagination from "./Pagination";
import { STAFF_TYPE_OPTIONS } from "./constants";

const PAGE_SIZE = 10;

const STAFF_TYPE_LABEL_MAP = STAFF_TYPE_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label;
  return acc;
}, {});

function staffRoleLabel(row) {
  if (row.staffType === "OTHER" && row.customTitle) return row.customTitle;
  return STAFF_TYPE_LABEL_MAP[row.staffType] || "Staff";
}

/* ---------- helpers ---------- */

function truncateEmail(email, headChars = 8) {
  if (!email || email === "—") return email;
  const [local, domain] = email.split("@");
  if (!domain) return email.length > 14 ? `${email.slice(0, 14)}…` : email;
  if (local.length <= headChars) return email;
  return `${local.slice(0, headChars)}…@${domain}`;
}

/**
 * Enhanced CopyButton with an attractive top-positioned tooltip & smooth animations.
 */
function CopyButton({ value, id, copiedId, onCopy, label = "Copy to clipboard" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isCopied = copiedId === id;

  return (
    <div 
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {(showTooltip || isCopied) && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
          <div
            className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-md shadow-md border whitespace-nowrap transition-colors duration-200 ${
              isCopied
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "bg-slate-900 dark:bg-slate-100 border-slate-800 dark:border-slate-200 text-white dark:text-slate-900"
            }`}
          >
            {isCopied ? "Copied!" : label}
          </div>
          <div
            className={`w-2 h-2 -mt-1 rotate-45 transition-colors duration-200 ${
              isCopied ? "bg-emerald-600" : "bg-slate-900 dark:bg-slate-100"
            }`}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => onCopy(value, id)}
        className={`p-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
          isCopied
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        aria-label={label}
      >
        {isCopied ? (
          <Check size={13} className="text-emerald-500 stroke-[2.5] animate-in zoom-in duration-150" />
        ) : (
          <Copy size={13} />
        )}
      </button>
    </div>
  );
}

export default function CredentialTable({ refreshTrigger }) {
  const [activeTab, setActiveTab] = useState("teachers");
  const [teachers, setTeachers] = useState({ items: [], total: 0 });
  const [students, setStudents] = useState({ items: [], total: 0 });
  const [staff, setStaff] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [exporting, setExporting] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const [tRes, sRes, stRes] = await Promise.allSettled([
        api.getTeachers({ search, page, limit: PAGE_SIZE }),
        api.getStudents({ search, page, limit: PAGE_SIZE }),
        api.getStaff({ search, page, limit: PAGE_SIZE }),
      ]);
      if (tRes.status === "fulfilled") {
        const data = tRes.value?.data || {};
        setTeachers({ items: data.items || [], total: data.total || 0 });
      }
      if (sRes.status === "fulfilled") {
        const data = sRes.value?.data || {};
        setStudents({ items: data.items || [], total: data.total || 0 });
      }
      if (stRes.status === "fulfilled") {
        const data = stRes.value?.data || {};
        setStaff({ items: data.items || [], total: data.total || 0 });
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, search, page, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  const copyToClipboard = async (text, id) => {
    if (!text || text === "—") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const togglePasswordVisibility = (slug) =>
    setVisiblePasswords((prev) => ({ ...prev, [slug]: !prev[slug] }));

  const openDeleteModal = (slug, name, role) =>
    setPendingDelete({ slug, name, role });
  const closeDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { slug, role } = pendingDelete;
    setDeleting(true);
    try {
      if (role === "teacher") await api.deleteTeacher(slug);
      else if (role === "staff") await api.deleteStaff(slug);
      else await api.deleteStudent(slug);
      setPendingDelete(null);
      fetchAccounts();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : `Failed to delete ${role}`;
      window.alert(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const isTeacherTab = activeTab === "teachers";
      const isStaffTab = activeTab === "staff";
      const fetcher = isTeacherTab
        ? api.getTeachers
        : isStaffTab
        ? api.getStaff
        : api.getStudents;
      const res = await fetcher({ search, page: 1, limit: 10000 });
      const rows = res?.data?.items || [];

      if (rows.length === 0) {
        window.alert("No records to export.");
        return;
      }

      const XLSX = await import("xlsx");

      const idLabel = isTeacherTab
        ? "Employee ID"
        : isStaffTab
        ? "Employee ID"
        : "Roll No";

      const exportRows = rows.map((row) => ({
        [idLabel]: isTeacherTab || isStaffTab ? row.employeeId : row.rollNumber,
        Name: `${row.firstName} ${row.lastName}`,
        ...(isStaffTab ? { Role: staffRoleLabel(row) } : {}),
        "Login Alias": row.userId?.email || "",
        "Contact Email": row.contactEmail || row.parentEmail || "",
        "Temporary Password": row.temporaryPassword || row.tempPassword || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      worksheet["!cols"] = isStaffTab
        ? [
            { wch: 16 },
            { wch: 24 },
            { wch: 20 },
            { wch: 32 },
            { wch: 28 },
            { wch: 20 },
          ]
        : [
            { wch: 16 },
            { wch: 24 },
            { wch: 32 },
            { wch: 28 },
            { wch: 20 },
          ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        isTeacherTab ? "Teachers" : isStaffTab ? "Staff" : "Students"
      );

      const fileName = `edusphere-${activeTab}-credentials-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      window.alert("Failed to export credentials. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const activeList =
    activeTab === "teachers"
      ? teachers.items
      : activeTab === "staff"
      ? staff.items
      : students.items;
  const activeTotal =
    activeTab === "teachers"
      ? teachers.total
      : activeTab === "staff"
      ? staff.total
      : students.total;
  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedItems = activeList;

  return (
    <div className="space-y-4">
      {/* Control Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("teachers")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "teachers"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Users size={14} />
            Teachers ({teachers.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "students"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <GraduationCap size={14} />
            Students ({students.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("staff")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "staff"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Briefcase size={14} />
            Staff ({staff.total})
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={exporting}
            className="h-9 px-2.5 rounded-xl"
            title="Download credentials as Excel"
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin text-indigo-600" />
            ) : (
              <FileSpreadsheet size={14} />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchAccounts}
            disabled={loading}
            className="h-9 px-2.5 rounded-xl"
            title="Refresh"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-indigo-600" : ""}
            />
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-indigo-600" />
            <p className="text-xs">Loading accounts…</p>
          </div>
        ) : pagedItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No accounts yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Use the form above to invite your first{" "}
              {activeTab === "teachers"
                ? "teacher"
                : activeTab === "staff"
                ? "staff member"
                : "student"}
              .
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
              <TableRow>
                <TableHead className="py-3 px-4 text-xs">
                  {activeTab === "students" ? "Roll No" : "Employee ID"}
                </TableHead>
                <TableHead className="py-3 px-4 text-xs">Name</TableHead>
                {activeTab === "staff" && (
                  <TableHead className="py-3 px-4 text-xs hidden sm:table-cell">Role</TableHead>
                )}
                <TableHead className="py-3 px-4 text-xs hidden sm:table-cell">Login alias</TableHead>
                <TableHead className="py-3 px-4 text-xs hidden md:table-cell">Contact email</TableHead>
                <TableHead className="py-3 px-4 text-xs">Password</TableHead>
                <TableHead className="py-3 px-4 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.map((row) => {
                const alias = row.userId?.email || "—";
                const contact = row.contactEmail || row.parentEmail || "—";
                const password =
                  row.temporaryPassword || row.tempPassword || null;
                const isPwVisible = !!visiblePasswords[row.slug];
                const rowRole =
                  activeTab === "teachers"
                    ? "teacher"
                    : activeTab === "staff"
                    ? "staff"
                    : "student";

                return (
                  <TableRow key={row.slug}>
                    <TableCell className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {activeTab === "students"
                        ? row.rollNumber
                        : row.employeeId}
                    </TableCell>
                    <TableCell className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {row.firstName} {row.lastName}
                    </TableCell>

                    {activeTab === "staff" && (
                      <TableCell className="py-3 px-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          {staffRoleLabel(row)}
                        </Badge>
                      </TableCell>
                    )}

                    <TableCell className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300">
                        <span title={alias}>{truncateEmail(alias)}</span>
                        <CopyButton
                          value={alias}
                          id={`alias-${row.slug}`}
                          copiedId={copiedId}
                          onCopy={copyToClipboard}
                          label="Copy alias"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <span title={contact}>{truncateEmail(contact)}</span>
                        <CopyButton
                          value={contact}
                          id={`contact-${row.slug}`}
                          copiedId={copiedId}
                          onCopy={copyToClipboard}
                          label="Copy contact"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-4">
                      {password ? (
                        <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300">
                          <span className="tracking-wide">
                            {isPwVisible ? password : "••••••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(row.slug)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={isPwVisible ? "Hide password" : "Show password"}
                          >
                            {isPwVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <CopyButton
                            value={password}
                            id={`pw-${row.slug}`}
                            copiedId={copiedId}
                            onCopy={copyToClipboard}
                            label="Copy password"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">
                          not available
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openDeleteModal(
                            row.slug,
                            `${row.firstName} ${row.lastName}`,
                            rowRole
                          )
                        }
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        title={`Delete ${rowRole}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {pagedItems.length > 0 && (
          <Pagination
            currentPage={safePage}
            totalPages={Math.max(1, Math.ceil(activeTotal / PAGE_SIZE))}
            totalItems={activeTotal}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmDeleteModal
        open={!!pendingDelete}
        title={`Delete ${pendingDelete?.role || "account"} account`}
        description={
          pendingDelete
            ? `This permanently removes ${pendingDelete.name}'s account and unassigns them. This cannot be undone.`
            : ""
        }
        loading={deleting}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}