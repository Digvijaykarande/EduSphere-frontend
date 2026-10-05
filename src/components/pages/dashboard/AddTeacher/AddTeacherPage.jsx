"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, FileSpreadsheet } from "lucide-react";

import AccountTypeCards from "./AccountTypeCards";
import CreateTeacherForm from "./CreateTeacherForm";
import CreateStudentForm from "./CreateStudentForm";
import CreateStaffForm from "./CreateStaffForm";
import CredentialTable from "./CredentialTable";

const FORM_BY_ROLE = {
  teacher: CreateTeacherForm,
  student: CreateStudentForm,
  staff: CreateStaffForm,
};

export default function AddTeacherPage() {
  const [activeMainTab, setActiveMainTab] = useState("create"); // "create" | "credentials"
  const [selectedRole, setSelectedRole] = useState("teacher"); // "teacher" | "student" | "staff"
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAccountCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const ActiveForm = FORM_BY_ROLE[selectedRole] || CreateTeacherForm;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header with Main Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Teacher, Student &amp; Staff Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provision new user accounts, view stored temporary credentials, and
            export spreadsheets.
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveMainTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === "create"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <UserPlus size={15} />
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab("credentials")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === "credentials"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FileSpreadsheet size={15} />
            Manage &amp; Export Credentials
          </button>
        </div>
      </div>

      {activeMainTab === "create" ? (
        <div className="space-y-8">
          <AccountTypeCards
            activeKey={selectedRole}
            onSelect={setSelectedRole}
          />

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <ActiveForm onAccountCreated={handleAccountCreated} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <CredentialTable refreshTrigger={refreshTrigger} />
        </div>
      )}
    </div>
  );
}
