"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CreditCard,
  Download,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Smartphone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentAvatar } from "./shared";
import { formatINR } from "@/lib/formatCurrency";
import { api, ApiError } from "@/lib/api";

export default function StudentView() {
  const [fee, setFee] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payNotice, setPayNotice] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [feeRes, paymentsRes] = await Promise.all([
          api.getMyFee({}),
          api.getMyFeePayments(),
        ]);
        if (cancelled) return;
        setFee(feeRes.data.fee);
        setPayments(paymentsRes.data.payments);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load your fee details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading your fee details…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <AlertCircle className="h-6 w-6 text-rose-500" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{error}</p>
      </div>
    );
  }

  const percentPaid = fee.totalFees > 0 ? Math.round((fee.paidAmount / fee.totalFees) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* PROFILE OVERVIEW */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <StudentAvatar
            name={fee.name}
            src={fee.avatar}
            className="h-16 w-16 border-2 border-primary/50 shadow-lg"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight">{fee.name}</h2>
            <p className="text-xs text-indigo-200 mt-0.5 font-medium">
              Roll No: {fee.rollNumber} • Class {fee.class}
            </p>
            <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Active Student
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-indigo-800/50 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Academic Year {fee.academicYear}
            </span>
            <span className="text-[11px] font-medium text-indigo-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              {percentPaid}% Cleared
            </span>
          </div>

          {fee.unassigned ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center text-sm text-indigo-200">
              No fees have been assigned to you for {fee.academicYear} yet. Check back once your school sets it up.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-200 font-bold mb-1">Total Fees</p>
                    <p className="text-xl font-mono font-bold text-white">{formatINR(fee.totalFees)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold mb-1">Paid</p>
                    <p className="text-xl font-mono font-bold text-emerald-400">{formatINR(fee.paidAmount)}</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-indigo-950/50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentPaid}%` }} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-1">Pending Amount</p>
                  <p className="text-3xl font-mono font-bold text-amber-400">{formatINR(fee.pendingAmount)}</p>
                </div>
                {fee.dueDate && (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-200/80 mt-2">
                    <Clock className="h-3.5 w-3.5" /> Due by{" "}
                    {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                )}
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center gap-3">
                <p className="text-xs text-indigo-200 font-medium text-center">
                  {fee.pendingAmount === 0
                    ? "You're all caught up for this term!"
                    : "Clear your pending dues to avoid late fees."}
                </p>
                <Button
                  onClick={() => setPayNotice(true)}
                  className={`w-full rounded-xl font-bold text-sm h-11 transition-all shadow-lg ${
                    fee.pendingAmount === 0
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-white text-indigo-900 hover:bg-slate-100"
                  }`}
                  disabled={fee.pendingAmount === 0}
                >
                  {fee.pendingAmount === 0 ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Fully Paid</>
                  ) : (
                    <><CreditCard className="w-4 h-4 mr-2" /> Pay {formatINR(fee.pendingAmount)}</>
                  )}
                </Button>
                {payNotice && (
                  <p className="text-[10px] text-indigo-200/80 text-center leading-relaxed">
                    Online payment isn't set up yet — please clear dues at the accounts office. Cash/UPI/cheque payments recorded there show up here automatically.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {!fee.unassigned && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Breakdown & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" /> Fee Breakdown
              </h3>
              <div className="space-y-4">
                {fee.breakdown.map((item, i) => {
                  const isFullyPaid = item.paidAmount >= item.amount;
                  const pct = item.amount > 0 ? (item.paidAmount / item.amount) * 100 : 0;
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-semibold text-foreground">{item.particular}</span>
                        <span className="font-mono text-muted-foreground">{formatINR(item.amount)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isFullyPaid ? "bg-success" : "bg-warning"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${isFullyPaid ? "text-success" : "text-warning"}`}>
                          {isFullyPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <Download className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Tax Certificate</p>
                      <p className="text-[10px] text-muted-foreground">Download Section 80G</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Manage AutoPay</p>
                      <p className="text-[10px] text-muted-foreground">UPI & Saved Cards</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Transactions */}
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Recent Fee Transactions</h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" /> Payments recorded by your school
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg gap-2">
                <Download className="h-3.5 w-3.5" /> All Receipts
              </Button>
            </div>

            <div className="divide-y divide-border flex-1">
              {payments.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No payments recorded yet.</p>
              )}
              {payments.map((tx) => (
                <div key={tx.id || tx.receiptNumber} className="py-4 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-success/10 text-success group-hover:bg-success/20 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{tx.method} • {tx.receiptNumber}</p>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        Paid on{" "}
                        {new Date(tx.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-extrabold text-foreground">{formatINR(tx.amount)}</p>
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider border-success/30 bg-success/10 text-success">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
