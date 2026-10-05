"use client";

import React, { useState } from "react";
import { useThemeStore } from "@/store/use-theme-store";
import { useAuthStore } from "@/store/authStore";
import {
  CreditCard,
  Save,
  Mail,
  MessageSquare,
  Smartphone,
  AlertCircle,
  FileText,
  Cloud,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
import GeneralInformationSection from "../../../components/pages/dashboard/settings/GeneralInformationSection";

// Define access rules for different sections.
const PERMISSIONS = {
  generalInfo: ["superadmin", "principal"],
  generalInfoEdit: ["superadmin", "principal"],
  notifications: ["superadmin", "principal", "teacher"],
  systemPrefs: ["superadmin", "principal", "teacher"],
  academicSession: ["superadmin", "principal"],
  dataBackup: ["superadmin"],
};

// Backend roles are UPPERCASE (SUPER_ADMIN / SCHOOL / TEACHER / STUDENT);
// PERMISSIONS above is keyed by lowercase tier. Map real → tier. Unknown /
// still-hydrating roles fall through to the least-privileged tier so we never
// briefly flash super-admin-only sections.
const ROLE_PERM_MAP = {
  SUPER_ADMIN: "superadmin",
  SCHOOL: "principal",
  TEACHER: "teacher",
  STUDENT: "teacher",
};

export default function SettingsPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const role = useAuthStore((state) => state.user?.role);
  const currentUserRole = ROLE_PERM_MAP[role] || "teacher";

  const [toggles, setToggles] = useState({
    email: true,
    sms: true,
    push: true,
    feeReminders: true,
    attendanceAlerts: true,
    examNotifications: true,
    showTips: true,
  });
  const [weeklyOff, setWeeklyOff] = useState(new Set(["Sat", "Sun"]));

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleWeeklyOff = (day) =>
    setWeeklyOff((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });

  // Helper function to check if the current user can view a section
  const hasAccess = (section) => PERMISSIONS[section].includes(currentUserRole);

  const Switch = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  // Thin wrapper around the shadcn Select so call sites below keep the same
  // "label + options" shape the old native-<select> helper had.
  const SettingsSelect = ({ label, children, className, ...props }) => (
    <div>
      <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</Label>
      <Select {...props}>
        <SelectTrigger
          className={`dash-focus w-full justify-between border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 h-auto text-sm text-foreground bg-white dark:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed ${className || ""}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Settings</h1>
          <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
            <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
            <span className="mx-2 text-slate-300">›</span>
            <span className="text-slate-700 dark:text-slate-300">Settings</span>
          </div>
        </div>
        <Button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg transition-all">
          <Save size={18} />
          Save Changes
        </Button>
      </div>

      <div>
        {/* Column 1 */}
        <div className="space-y-6">
          
          {/* General Information */}
          <GeneralInformationSection hasAccess={hasAccess} />

         {/* Academic Session */}
          {hasAccess("academicSession") && (
            <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-1">Academic Session</h2>
              <p className="text-sm text-slate-500 mb-6">Set the current term, calendar, and grading system.</p>

              <div className="space-y-5">
                <SettingsSelect label="Current Academic Session" defaultValue="2024-2025">
                  <SelectItem value="2024-2025">2024 - 2025</SelectItem>
                  <SelectItem value="2023-2024">2023 - 2024</SelectItem>
                </SettingsSelect>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Session Start</Label>
                    <Input type="date" defaultValue="2024-06-01" className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800" />
                  </div>
                  <div>
                    <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Session End</Label>
                    <Input type="date" defaultValue="2025-04-30" className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800" />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Weekly Off Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        onClick={() => toggleWeeklyOff(day)}
                        className={`px-3 py-1.5 h-auto rounded-lg text-xs font-semibold border transition-colors ${
                          weeklyOff.has(day)
                            ? "bg-primary text-white border-primary hover:bg-primary/90"
                            : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <SettingsSelect label="Grading System" defaultValue="percentage">
                  <SelectItem value="percentage">Percentage (0–100)</SelectItem>
                  <SelectItem value="gpa">GPA (4.0 scale)</SelectItem>
                  <SelectItem value="letter">Letter Grade (A–F)</SelectItem>
                </SettingsSelect>
              </div>
            </div>
          )}

         
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          {hasAccess("notifications") && (
            <div className="dashboard-card p-7 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm" style={{marginTop:"7px"}}>
              <h2 className="text-lg font-bold text-foreground mb-1">Notification Preferences</h2>
              <p className="text-sm text-slate-500 mb-6">Choose how you want to receive notifications.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Mail, tone: "bg-[#eef0ff] text-primary" },
                  { key: "feeReminders", label: "Fee Reminders", desc: "Receive fee reminder notifications", icon: CreditCard, tone: "bg-green-50 text-green-600" },
                  { key: "sms", label: "SMS Notifications", desc: "Receive important updates via SMS", icon: MessageSquare, tone: "bg-blue-50 text-blue-500" },
                  { key: "attendanceAlerts", label: "Attendance Alerts", desc: "Receive attendance related alerts", icon: AlertCircle, tone: "bg-orange-50 text-orange-500" },
                  { key: "push", label: "Push Notifications", desc: "Receive push notifications in browser", icon: Smartphone, tone: "bg-yellow-50 text-yellow-500" },
                  { key: "examNotifications", label: "Exam Notifications", desc: "Receive exam related notifications", icon: FileText, tone: "bg-indigo-50 text-indigo-500" },
                ].map(({ key, label, desc, icon: Icon, tone }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tone}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{label}</div>
                        <div className="text-[11px] text-slate-400">{desc}</div>
                      </div>
                    </div>
                    <Switch checked={toggles[key]} onChange={() => handleToggle(key)} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{display:"flex",flexDirection:'row',flexWrap:"wrap", justifyContent:"space-between", gap:'10px'}}>
            {/* System Preferences */}
            {hasAccess("systemPrefs") && (
              <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm" style={{minWidth:'49%'}}>
                <h2 className="text-lg font-bold text-foreground mb-1">System Preferences</h2>
                <p className="text-sm text-slate-500 mb-6">Customize system-wide preferences.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <SettingsSelect label="Appearance" value={theme} onValueChange={(value) => setTheme(value)}>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SettingsSelect>
                  <SettingsSelect label="Items Per Page" defaultValue="25">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SettingsSelect>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Show Tips</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Show helpful tips and suggestions</div>
                  </div>
                  <Switch checked={toggles.showTips} onChange={() => handleToggle("showTips")} />
                </div>
              </div>
            )}

            {/* Data & Backup */}
            {hasAccess("dataBackup") && (
              <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm" style={{minWidth:'49%'}}>
                <h2 className="text-lg font-bold text-foreground mb-1">Data & Backup</h2>
                <p className="text-sm text-slate-500 mb-5">Manage backups and data related actions.</p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                        <Cloud size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Backup Data</div>
                        <div className="text-[11px] text-slate-500">Create a backup of your system data</div>
                      </div>
                    </div>
                    <Button className="px-4 py-2 h-auto border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-primary hover:bg-[#eef0ff] dark:hover:bg-primary/10 hover:border-primary/30 transition-colors bg-white dark:bg-slate-800 shrink-0">
                      Create Backup
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <Download size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Export Data</div>
                        <div className="text-[11px] text-slate-500">Export system data to CSV/Excel</div>
                      </div>
                    </div>
                    <Button className="flex items-center gap-1.5 px-4 py-2 h-auto border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-primary hover:bg-[#eef0ff] dark:hover:bg-primary/10 hover:border-primary/30 transition-colors bg-white dark:bg-slate-800 shrink-0">
                      <Download size={14} /> Export
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}