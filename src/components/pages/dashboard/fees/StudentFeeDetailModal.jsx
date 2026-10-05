// src/components/pages/dashboard/fees/StudentFeeDetailModel.jsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Save, X, IndianRupee, Receipt, Loader2, CheckCircle2, Clock } from "lucide-react";
import { StudentAvatar, StatusBadge } from "./shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { api, ApiError } from "@/lib/api";

const PAYMENT_METHODS = ["Cash", "Cheque", "UPI", "Card", "Bank Transfer", "Online"];

export default function StudentFeeDetailModal({ student, onClose, canManageFees = false, onChanged }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [detail, setDetail] = useState(student); // enriched with payment history once fetched
  const [detailLoading, setDetailLoading] = useState(false);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDraft, setPaymentDraft] = useState({ amount: "", method: "Cash", referenceNo: "", note: "" });
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Reset + refetch whenever a different student is selected.
  useEffect(() => {
    setFormData(student);
    setDetail(student);
    setIsEditing(false);
    setShowPaymentForm(false);
    setPaymentError(null);
    if (!student?.id) return;

    let cancelled = false;
    setDetailLoading(true);
    api
      .getStudentFeeDetail(student.id)
      .then((res) => {
        if (cancelled) return;
        const d = res.data.detail;
        setDetail({
          ...student,
          totalFees: d.totalFees,
          paidAmount: d.paidAmount,
          pendingAmount: d.pendingAmount,
          status: d.status,
          breakdown: d.breakdown,
          payments: d.payments,
        });
      })
      .catch(() => {
        // Fall back silently to the row data already shown — the list view
        // already has totals/breakdown, we just won't have payment history.
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [student]);

  if (!student) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await api.updateStudent(student.id, {
        parentName: formData.guardianName,
        parentPhone: formData.phone,
        parentEmail: formData.email,
      });
      setIsEditing(false);
      onChanged?.();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecordPayment = async () => {
    const amount = Number(paymentDraft.amount);
    if (!amount || amount <= 0) {
      setPaymentError("Enter a valid amount.");
      return;
    }
    setPaymentSaving(true);
    setPaymentError(null);
    try {
      const res = await api.recordStudentPayment(student.id, {
        amount,
        method: paymentDraft.method,
        referenceNo: paymentDraft.referenceNo,
        note: paymentDraft.note,
      });
      const { fee, payment } = res.data;
      setDetail((prev) => ({
        ...prev,
        totalFees: fee.totalFees,
        paidAmount: fee.paidAmount,
        pendingAmount: fee.pendingAmount,
        status: fee.status,
        breakdown: fee.breakdown,
        payments: [payment, ...(prev.payments || [])],
      }));
      setPaymentDraft({ amount: "", method: "Cash", referenceNo: "", note: "" });
      setShowPaymentForm(false);
      onChanged?.();
    } catch (err) {
      setPaymentError(err instanceof ApiError ? err.message : "Failed to record payment.");
    } finally {
      setPaymentSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <Button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-transparent hover:bg-transparent h-auto p-0"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {canManageFees &&
          (isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setFormData(student);
                  setIsEditing(false);
                  setSaveError(null);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 h-auto rounded-md transition-colors bg-transparent hover:bg-transparent"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 h-auto rounded-lg shadow-sm transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:bg-primary/10 px-2 py-1 h-auto rounded-md transition-colors bg-transparent"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Student
            </Button>
          ))}
      </div>

      {saveError && (
        <p className="text-xs font-semibold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {saveError}
        </p>
      )}

      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <StudentAvatar name={formData.name} src={formData.avatar} className="w-16 h-16" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Roll No: {formData.rollNo} • Class {formData.class}
          </p>
        </div>
      </div>

      {/* Quick Fee Highlights Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Fees</p>
          <p className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">₹{detail.totalFees.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/10">
          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Paid Amount</p>
          <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{detail.paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10">
          <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Pending</p>
          <p className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">₹{detail.pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
          <div>
            <StatusBadge status={detail.status} />
          </div>
        </div>
      </div>

      {/* Record Payment (principal/school only) */}
      {canManageFees && (
        <div className="space-y-3 pt-2">
          {!showPaymentForm ? (
            <Button
              onClick={() => setShowPaymentForm(true)}
              disabled={detail.pendingAmount <= 0}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 h-auto rounded-xl shadow-sm transition-colors"
            >
              <IndianRupee className="h-3.5 w-3.5" />
              {detail.pendingAmount <= 0 ? "Fully Paid" : "Record Payment"}
            </Button>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Record Payment — Pending ₹{detail.pendingAmount.toLocaleString()}
              </h4>
              {paymentError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  {paymentError}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={paymentDraft.amount}
                  onChange={(e) => setPaymentDraft((p) => ({ ...p, amount: e.target.value }))}
                  className="h-9 text-xs"
                />
                <Select
                  value={paymentDraft.method}
                  onValueChange={(v) => setPaymentDraft((p) => ({ ...p, method: v }))}
                >
                  <SelectTrigger className="h-9 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m} className="text-xs">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Reference no. (optional)"
                  value={paymentDraft.referenceNo}
                  onChange={(e) => setPaymentDraft((p) => ({ ...p, referenceNo: e.target.value }))}
                  className="h-9 text-xs sm:col-span-2"
                />
                <Input
                  placeholder="Note (optional)"
                  value={paymentDraft.note}
                  onChange={(e) => setPaymentDraft((p) => ({ ...p, note: e.target.value }))}
                  className="h-9 text-xs sm:col-span-2"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Button
                  onClick={() => { setShowPaymentForm(false); setPaymentError(null); }}
                  className="w-full sm:flex-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 h-auto rounded-lg border border-slate-200 dark:border-slate-700 transition-colors bg-transparent hover:bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRecordPayment}
                  disabled={paymentSaving}
                  className="w-full sm:flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-2 h-auto rounded-lg shadow-sm transition-colors disabled:opacity-60"
                >
                  {paymentSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editable Contact & Fee Details */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Details</h4>
        <div className="text-xs space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Admission No</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formData.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Guardian Name</span>
            {isEditing ? (
              <Input
                value={formData.guardianName}
                onChange={(e) => handleChange("guardianName", e.target.value)}
                className="h-7 w-40 text-xs text-right font-semibold"
              />
            ) : (
              <span className="font-semibold text-slate-900 dark:text-white">{formData.guardianName}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Phone Number</span>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-7 w-40 text-xs text-right font-medium"
              />
            ) : (
              <span className="font-medium text-slate-900 dark:text-white">{formData.phone}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Email Address</span>
            {isEditing ? (
              <Input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-7 w-48 text-xs text-right font-medium"
              />
            ) : (
              <span className="font-medium text-slate-900 dark:text-white">{formData.email}</span>
            )}
          </div>
        </div>
      </div>

      {/* Particulars Fee Structure Breakdown Table */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Fees Structure (Class {formData.class})
        </h4>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <Table className="text-left text-xs">
            <TableHeader className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 py-2.5 h-auto">Particulars</TableHead>
                <TableHead className="px-4 py-2.5 h-auto text-right">Paid / Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {detail.breakdown.map((item, idx) => (
                <TableRow key={idx} className="border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <TableCell className="px-4 py-2.5 font-medium">{item.particular}</TableCell>
                  <TableCell className="px-4 py-2.5 text-right font-mono font-semibold">
                    {item.paidAmount != null ? (
                      <span className={item.paidAmount >= item.amount ? "text-emerald-600 dark:text-emerald-400" : ""}>
                        {item.paidAmount.toLocaleString()} / {item.amount.toLocaleString()}
                      </span>
                    ) : (
                      item.amount.toLocaleString()
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-slate-50/80 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="px-4 py-3 text-slate-900 dark:text-white">Total Fees</TableCell>
                <TableCell className="px-4 py-3 text-right font-mono text-primary text-sm">₹{detail.totalFees.toLocaleString()}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5" /> Payment History
        </h4>
        {detailLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : detail.payments?.length ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {detail.payments.map((p) => (
              <div key={p.id || p.receiptNumber} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.method} • {p.receiptNumber}</p>
                    <p className="text-[10px] text-slate-500">{new Date(p.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <p className="text-xs font-mono font-extrabold text-slate-900 dark:text-white shrink-0">₹{p.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No payments recorded yet.</p>
        )}
      </div>
    </div>
  );
}