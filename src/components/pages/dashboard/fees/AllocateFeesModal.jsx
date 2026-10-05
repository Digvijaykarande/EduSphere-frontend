"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { api, ApiError } from "@/lib/api";

function getDefaultAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const startYear = now.getMonth() >= 3 ? year : year - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

const emptyHead = () => ({ particular: "", amount: "" });

export default function AllocateFeesModal({ open, onClose, gradeClasses = [], onSaved }) {
  const [view, setView] = useState("list");
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [assigningId, setAssigningId] = useState(null);
  const [assignOverwrite, setAssignOverwrite] = useState(false);
  const [assignResult, setAssignResult] = useState(null);
  const [assignError, setAssignError] = useState(null);

  const loadStructures = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await api.getFeeStructures({});
      setStructures(res.data.structures);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load fee structures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setView("list");
    setForm(null);
    setAssignResult(null);
    setAssignError(null);
    loadStructures();
  }, [open]);

  if (!open) return null;

  const startCreate = () => {
    setForm({
      id: null,
      gradeClass: gradeClasses[0] || "",
      academicYear: getDefaultAcademicYear(),
      heads: [emptyHead()],
      dueDate: "",
    });
    setSaveError(null);
    setView("form");
  };

  const startEdit = (structure) => {
    setForm({
      id: structure._id,
      gradeClass: structure.gradeClass,
      academicYear: structure.academicYear,
      heads: structure.heads.map((h) => ({ particular: h.particular, amount: String(h.amount) })),
      dueDate: structure.dueDate ? structure.dueDate.slice(0, 10) : "",
    });
    setSaveError(null);
    setView("form");
  };

  const updateHead = (idx, field, value) => {
    setForm((f) => ({
      ...f,
      heads: f.heads.map((h, i) => (i === idx ? { ...h, [field]: value } : h)),
    }));
  };

  const addHeadRow = () => setForm((f) => ({ ...f, heads: [...f.heads, emptyHead()] }));
  const removeHeadRow = (idx) =>
    setForm((f) => ({ ...f, heads: f.heads.filter((_, i) => i !== idx) }));

  const total = (form?.heads || []).reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

  const handleSaveStructure = async () => {
    setSaveError(null);

    if (!form.gradeClass.trim()) {
      setSaveError("Select or enter a class.");
      return;
    }
    if (!form.academicYear.trim()) {
      setSaveError("Academic year is required (e.g. 2025-26).");
      return;
    }
    const cleanedHeads = form.heads
      .map((h) => ({ particular: h.particular.trim(), amount: Number(h.amount) }))
      .filter((h) => h.particular && h.amount > 0);
    if (cleanedHeads.length === 0) {
      setSaveError("Add at least one fee head with a valid amount.");
      return;
    }

    setSaving(true);
    try {
      await api.upsertFeeStructure({
        academicYear: form.academicYear.trim(),
        gradeClass: form.gradeClass.trim(),
        heads: cleanedHeads,
        dueDate: form.dueDate || null,
      });
      await loadStructures();
      setView("list");
      onSaved?.();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save fee structure.");
    } finally {
      setSaving(false);
    }
  };

  const openAssign = (structure) => {
    setAssigningId(structure._id);
    setAssignOverwrite(false);
    setAssignResult(null);
    setAssignError(null);
  };

  const handleAssign = async (structure) => {
    setAssignError(null);
    setAssignResult(null);
    try {
      const res = await api.bulkAssignFee({
        academicYear: structure.academicYear,
        gradeClass: structure.gradeClass,
        skipExisting: !assignOverwrite,
      });
      setAssignResult({ id: structure._id, ...res.data });
      onSaved?.();
    } catch (err) {
      setAssignError(err instanceof ApiError ? err.message : "Failed to assign fees.");
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent maxWidth="max-w-2xl">
        <ModalHeader>
          <div className="flex items-center gap-2">
            {view === "form" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("list")}
                className="h-7 w-7"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <ModalTitle>
              {view === "list" ? "Allocate Fees" : form?.id ? "Edit Fee Structure" : "New Fee Structure"}
            </ModalTitle>
          </div>
        </ModalHeader>

        <div className="py-4 overflow-y-auto max-h-[70vh]">
          {view === "list" ? (
            <div className="space-y-4">
              <Button
                onClick={startCreate}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-1.5" /> New Fee Structure
              </Button>

              {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-medium">Loading…</span>
                </div>
              ) : loadError ? (
                <div className="flex items-center gap-2 py-6 justify-center text-rose-600 text-xs font-semibold">
                  <AlertCircle className="h-4 w-4" /> {loadError}
                </div>
              ) : structures.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">
                  No fee structures yet. Create one to start collecting fees for a class.
                </p>
              ) : (
                <div className="space-y-3">
                  {structures.map((s) => (
                    <div
                      key={s._id}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Class {s.gradeClass} <span className="text-slate-400 font-medium">• {s.academicYear}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {s.heads.length} fee heads • Total ₹{(s.totalAmount || 0).toLocaleString()}
                            {s.dueDate && ` • Due ${new Date(s.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(s)}
                            className="text-primary hover:bg-primary/10"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAssign(s)}
                            className="text-emerald-600 hover:bg-emerald-500/10"
                          >
                            <Users className="h-3.5 w-3.5 mr-1" /> Assign
                          </Button>
                        </div>
                      </div>

                      {assigningId === s._id && (
                        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-lg p-3 space-y-2">
                          <label className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                            <input
                              type="checkbox"
                              checked={assignOverwrite}
                              onChange={(e) => setAssignOverwrite(e.target.checked)}
                              className="mt-0.5"
                            />
                            Overwrite students who already have a fee ledger for {s.academicYear}
                            (their current breakdown will be replaced — payments already made stay recorded).
                          </label>
                          {assignError && (
                            <p className="text-[11px] font-semibold text-rose-600">{assignError}</p>
                          )}
                          {assignResult?.id === s._id && (
                            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Assigned to {assignResult.assigned} of {assignResult.totalStudents} students
                              {assignResult.skipped > 0 && ` (${assignResult.skipped} already had fees, skipped)`}.
                            </p>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAssigningId(null)}
                              className="flex-1"
                            >
                              Close
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAssign(s)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Confirm Assign
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {saveError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  {saveError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Class</Label>
                  {gradeClasses.length > 0 ? (
                    <Select
                      value={form.gradeClass}
                      onValueChange={(v) => setForm((f) => ({ ...f, gradeClass: v }))}
                      disabled={!!form.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeClasses.map((c) => (
                          <SelectItem key={c} value={c}>
                            Class {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={form.gradeClass}
                      onChange={(e) => setForm((f) => ({ ...f, gradeClass: e.target.value }))}
                      placeholder="e.g. 10"
                      disabled={!!form.id}
                    />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Academic Year</Label>
                  <Input
                    value={form.academicYear}
                    onChange={(e) => setForm((f) => ({ ...f, academicYear: e.target.value }))}
                    placeholder="2025-26"
                    disabled={!!form.id}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Due Date (optional)</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="w-full sm:w-56"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Fee Heads</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addHeadRow}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Head
                  </Button>
                </div>

                <div className="space-y-2">
                  {form.heads.map((h, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <Input
                        value={h.particular}
                        onChange={(e) => updateHead(idx, "particular", e.target.value)}
                        placeholder="Particular (e.g. Tuition Fees)"
                        className="flex-1"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={h.amount}
                          onChange={(e) => updateHead(idx, "amount", e.target.value)}
                          placeholder="Amount"
                          className="w-full sm:w-32"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHeadRow(idx)}
                          disabled={form.heads.length === 1}
                          className="h-9 w-9 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500">Total</span>
                  <span className="text-sm font-mono font-extrabold text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {view === "form" && (
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setView("list")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveStructure}
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              {form?.id ? "Save Changes" : "Create Structure"}
            </Button>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}