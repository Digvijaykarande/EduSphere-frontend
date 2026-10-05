"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @param {"teacher"|"student"} role
 * @param {{name: string, alias: string, slug: string, contactEmail: string}} account
 * @param {() => void} onCreateAnother
 */
export default function SuccessPanel({ role, account, onCreateAnother }) {
  const roleLabel =
    role === "teacher" ? "Teacher" : role === "staff" ? "Staff" : "Student";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-500/10 p-6"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {roleLabel} invitation sent
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            A verification email has been sent to{" "}
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {account.contactEmail}
            </span>
            . Once they verify, they will receive a login alias and temporary
            password at the same address.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5">
          <KeyRound size={14} className="text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Generated login alias
            </p>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate block">
              {account.alias}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5">
          <Mail size={14} className="text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Slug (internal id)
            </p>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate block">
              {account.slug}
            </span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={onCreateAnother}
        className="mt-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold h-9 px-4"
      >
        Invite another {roleLabel.toLowerCase()}
      </Button>
    </motion.div>
  );
}