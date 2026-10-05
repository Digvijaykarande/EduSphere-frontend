"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

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

import { api, ApiError } from "@/lib/api";
import {
  GENDER_OPTIONS,
  QUALIFICATION_OPTIONS,
  STAFF_TYPE_OPTIONS,
  STAFF_DEPARTMENT_OPTIONS,
} from "./constants";
import SuccessPanel from "./SuccessPanel";

const EMPLOYEE_ID_PREFIX = "STF-";
const OTHER_STAFF_TYPE = "OTHER";

const emptyForm = {
  contactEmail: "",
  firstName: "",
  lastName: "",
  employeeIdNumber: "",
  gender: "",
  staffType: "",
  customTitle: "",
  qualification: "",
  customQualification: "",
  experience: "",
  department: "",
};

const OTHER_QUALIFICATION = "Other";
const QUALIFICATION_SELECT_OPTIONS = [
  ...QUALIFICATION_OPTIONS,
  OTHER_QUALIFICATION,
];

export default function CreateStaffForm({ onAccountCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [experienceError, setExperienceError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdAccount, setCreatedAccount] = useState(null);

  const fullEmployeeId = form.employeeIdNumber.trim()
    ? `${EMPLOYEE_ID_PREFIX}${form.employeeIdNumber.trim()}`
    : "";

  const effectiveQualification =
    form.qualification === OTHER_QUALIFICATION
      ? form.customQualification.trim()
      : form.qualification;

  const isCustomTitleRequired = form.staffType === OTHER_STAFF_TYPE;
  const effectiveTitle = isCustomTitleRequired
    ? form.customTitle.trim()
    : STAFF_TYPE_OPTIONS.find((o) => o.value === form.staffType)?.label || "";

  const isExperienceValid =
    form.experience.trim() === "" ||
    (Number(form.experience) >= 0 && Number(form.experience) <= 60);

  const isValid =
    form.contactEmail.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    fullEmployeeId &&
    form.gender &&
    form.staffType &&
    effectiveTitle &&
    isExperienceValid;

  const setField = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleExperienceChange = (raw) => {
    setField("experience")(raw);
    if (raw.trim() === "") return setExperienceError(null);
    const n = Number(raw);
    if (Number.isNaN(n)) setExperienceError("Enter a valid number.");
    else if (n < 0) setExperienceError("Experience cannot be negative.");
    else if (n > 60) setExperienceError("Experience cannot exceed 60 years.");
    else setExperienceError(null);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setError(null);
    setExperienceError(null);
    setCreatedAccount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createStaff({
        contactEmail: form.contactEmail.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        employeeId: fullEmployeeId,
        gender: form.gender,
        staffType: form.staffType,
        customTitle: isCustomTitleRequired ? form.customTitle.trim() : undefined,
        qualification: effectiveQualification || undefined,
        experience: Number(form.experience) || 0,
        department: form.department || undefined,
      });

      const data = res.data || res;
      setCreatedAccount({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        alias: data.alias,
        slug: data.slug,
        contactEmail: data.contactEmail,
      });
      if (onAccountCreated) onAccountCreated();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to create staff account.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdAccount) {
    return (
      <SuccessPanel
        role="staff"
        account={createdAccount}
        onCreateAnother={resetForm}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="st-contactEmail">Staff member's personal email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="st-contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setField("contactEmail")(e.target.value)}
              placeholder="staff@school.com"
              required
              className="pl-10"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Verification email will be sent here. They log in with a
            generated alias (e.g. <code>ravi.patil.a3f9k1b4@edusphere.app</code>).
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="st-staffType">Staff role</Label>
          <Select
            value={form.staffType}
            onValueChange={(val) => {
              setField("staffType")(val);
              if (val !== OTHER_STAFF_TYPE) setField("customTitle")("");
            }}
          >
            <SelectTrigger id="st-staffType">
              <SelectValue placeholder="Select staff role" />
            </SelectTrigger>
            <SelectContent>
              {STAFF_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isCustomTitleRequired && (
            <Input
              className="mt-2"
              value={form.customTitle}
              onChange={(e) => setField("customTitle")(e.target.value)}
              placeholder="Enter staff title (e.g. Groundskeeper)"
              required
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="st-firstName">First name</Label>
          <Input
            id="st-firstName"
            value={form.firstName}
            onChange={(e) => setField("firstName")(e.target.value)}
            placeholder="Ravi"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="st-lastName">Last name</Label>
          <Input
            id="st-lastName"
            value={form.lastName}
            onChange={(e) => setField("lastName")(e.target.value)}
            placeholder="Patil"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="st-employeeId">Employee ID</Label>
          <div className="flex items-stretch rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="flex items-center px-3 text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 select-none">
              {EMPLOYEE_ID_PREFIX}
            </span>
            <Input
              id="st-employeeId"
              value={form.employeeIdNumber}
              onChange={(e) =>
                setField("employeeIdNumber")(e.target.value.replace(/\s/g, ""))
              }
              placeholder="201"
              required
              className="border-0 rounded-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="st-gender">Gender</Label>
          <Select value={form.gender} onValueChange={setField("gender")}>
            <SelectTrigger id="st-gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="st-department">Department (optional)</Label>
          <Select value={form.department} onValueChange={setField("department")}>
            <SelectTrigger id="st-department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {STAFF_DEPARTMENT_OPTIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="st-experience">Experience (years, optional)</Label>
          <Input
            id="st-experience"
            type="number"
            min={0}
            max={60}
            value={form.experience}
            onChange={(e) => handleExperienceChange(e.target.value)}
            placeholder="3"
            aria-invalid={!!experienceError}
            className={
              experienceError
                ? "border-rose-400 focus-visible:ring-rose-400"
                : ""
            }
          />
          {experienceError && (
            <p className="text-xs text-rose-500">{experienceError}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="st-qualification">Qualification (optional)</Label>
        <Select
          value={form.qualification}
          onValueChange={(val) => {
            setField("qualification")(val);
            if (val !== OTHER_QUALIFICATION) setField("customQualification")("");
          }}
        >
          <SelectTrigger id="st-qualification">
            <SelectValue placeholder="Select qualification" />
          </SelectTrigger>
          <SelectContent>
            {QUALIFICATION_SELECT_OPTIONS.map((q) => (
              <SelectItem key={q} value={q}>
                {q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.qualification === OTHER_QUALIFICATION && (
          <Input
            className="mt-2"
            value={form.customQualification}
            onChange={(e) => setField("customQualification")(e.target.value)}
            placeholder="Enter qualification"
          />
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 px-3.5 py-2.5 text-xs text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!isValid || submitting}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 h-10 text-sm font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 size={15} className="mr-2 animate-spin" />
            Sending invitation…
          </>
        ) : (
          "Invite staff member"
        )}
      </Button>
    </form>
  );
}
