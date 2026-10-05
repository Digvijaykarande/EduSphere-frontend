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
  SUBJECT_OPTIONS,
  QUALIFICATION_OPTIONS,
} from "./constants";
import SuccessPanel from "./SuccessPanel";

const EMPLOYEE_ID_PREFIX = "EMP-";

const emptyForm = {
  contactEmail: "",
  firstName: "",
  lastName: "",
  employeeIdNumber: "",
  gender: "",
  qualification: "",
  customQualification: "",
  experience: "",
  subjects: [],
};

const OTHER_QUALIFICATION = "Other";
const QUALIFICATION_SELECT_OPTIONS = [
  ...QUALIFICATION_OPTIONS,
  OTHER_QUALIFICATION,
];

export default function CreateTeacherForm({ onAccountCreated }) {
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

  const isExperienceValid =
    form.experience.trim() === "" ||
    (Number(form.experience) >= 0 && Number(form.experience) <= 60);

  const isValid =
    form.contactEmail.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    fullEmployeeId &&
    form.gender &&
    form.qualification &&
    effectiveQualification &&
    form.subjects.length > 0 &&
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

  const toggleSubject = (subject) =>
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter((s) => s !== subject)
        : [...f.subjects, subject],
    }));

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
      // The principal provides the contact email (real teacher's email).
      // The server generates the login alias and temp password, sends the
      // verification email, and returns the alias + slug so the principal
      // can confirm what was created.
      const res = await api.createTeacher({
        contactEmail: form.contactEmail.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        employeeId: fullEmployeeId,
        gender: form.gender,
        qualification: effectiveQualification,
        experience: Number(form.experience) || 0,
        subjects: form.subjects,
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
          : "Failed to create teacher account.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdAccount) {
    return <SuccessPanel role="teacher" account={createdAccount} onCreateAnother={resetForm} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="t-contactEmail">Teacher's personal email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="t-contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setField("contactEmail")(e.target.value)}
              placeholder="edna@school.com"
              required
              className="pl-10"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Verification email will be sent here. The teacher logs in with a
            generated alias (e.g. <code>edna.krabappel.a3f9k1b4@edusphere.app</code>).
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="t-firstName">First name</Label>
          <Input
            id="t-firstName"
            value={form.firstName}
            onChange={(e) => setField("firstName")(e.target.value)}
            placeholder="Edna"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="t-lastName">Last name</Label>
          <Input
            id="t-lastName"
            value={form.lastName}
            onChange={(e) => setField("lastName")(e.target.value)}
            placeholder="Krabappel"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="t-employeeId">Employee ID</Label>
          <div className="flex items-stretch rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="flex items-center px-3 text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 select-none">
              {EMPLOYEE_ID_PREFIX}
            </span>
            <Input
              id="t-employeeId"
              value={form.employeeIdNumber}
              onChange={(e) =>
                setField("employeeIdNumber")(
                  e.target.value.replace(/\s/g, "")
                )
              }
              placeholder="101"
              required
              className="border-0 rounded-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="t-gender">Gender</Label>
          <Select value={form.gender} onValueChange={setField("gender")}>
            <SelectTrigger id="t-gender">
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
          <Label htmlFor="t-qualification">Qualification</Label>
          <Select
            value={form.qualification}
            onValueChange={(val) => {
              setField("qualification")(val);
              if (val !== OTHER_QUALIFICATION)
                setField("customQualification")("");
            }}
          >
            <SelectTrigger id="t-qualification">
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
              required
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="t-experience">Experience (years)</Label>
          <Input
            id="t-experience"
            type="number"
            min={0}
            max={60}
            value={form.experience}
            onChange={(e) => handleExperienceChange(e.target.value)}
            placeholder="5"
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
        <Label>Subjects</Label>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_OPTIONS.map((subject) => {
            const active = form.subjects.includes(subject);
            return (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  active
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>
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
          "Invite teacher"
        )}
      </Button>
    </form>
  );
}