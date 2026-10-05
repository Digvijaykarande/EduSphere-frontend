"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  CLASS_OPTIONS,
  SECTION_OPTIONS,
} from "./constants";
import SuccessPanel from "./SuccessPanel";

const emptyForm = {
  contactEmail: "", // parent's email
  firstName: "",
  middleName: "",
  lastName: "",
  motherName: "",
  rollNumber: "",
  gradeClass: "",
  section: "",
  gender: "",
  parentPhone: "",
  address: "",
};

export default function CreateStudentForm({ onAccountCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdAccount, setCreatedAccount] = useState(null);

  const isValid =
    form.contactEmail.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.rollNumber.trim() &&
    form.gradeClass &&
    form.section &&
    form.gender;

  const setField = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setError(null);
    setCreatedAccount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createStudent({
        contactEmail: form.contactEmail.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        rollNumber: form.rollNumber.trim(),
        gradeClass: form.gradeClass,
        section: form.section,
        gender: form.gender,
        address: form.address.trim() || undefined,
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
          : "Failed to create student account.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdAccount) {
    return <SuccessPanel role="student" account={createdAccount} onCreateAnother={resetForm} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="s-contactEmail">Parent / guardian email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="s-contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setField("contactEmail")(e.target.value)}
              placeholder="parent@example.com"
              required
              className="pl-10"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Verification + welcome emails go here. The student logs in with a
            generated alias (e.g. <code>rahul.sharma.a3f9k1b4@edusphere.app</code>).
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="s-firstName">First name</Label>
          <Input
            id="s-firstName"
            value={form.firstName}
            onChange={(e) => setField("firstName")(e.target.value)}
            placeholder="Rahul"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-middleName">Middle name (optional)</Label>
          <Input
            id="s-middleName"
            value={form.middleName}
            onChange={(e) => setField("middleName")(e.target.value)}
            placeholder="Kumar"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-lastName">Last name</Label>
          <Input
            id="s-lastName"
            value={form.lastName}
            onChange={(e) => setField("lastName")(e.target.value)}
            placeholder="Sharma"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-motherName">Mother's name (optional)</Label>
          <Input
            id="s-motherName"
            value={form.motherName}
            onChange={(e) => setField("motherName")(e.target.value)}
            placeholder="Sunita"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="s-rollNumber">Roll number</Label>
          <Input
            id="s-rollNumber"
            value={form.rollNumber}
            onChange={(e) => setField("rollNumber")(e.target.value)}
            placeholder="MCA-2YR-01"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-gender">Gender</Label>
          <Select value={form.gender} onValueChange={setField("gender")}>
            <SelectTrigger id="s-gender">
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
          <Label htmlFor="s-gradeClass">Class</Label>
          <Select
            value={form.gradeClass}
            onValueChange={setField("gradeClass")}
          >
            <SelectTrigger id="s-gradeClass">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-section">Section</Label>
          <Select value={form.section} onValueChange={setField("section")}>
            <SelectTrigger id="s-section">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {SECTION_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="s-address">Address (optional)</Label>
        <Textarea
          id="s-address"
          value={form.address}
          onChange={(e) => setField("address")(e.target.value)}
          rows={2}
          style={{ resize: "none" }}
          placeholder="123, Main Street, City, State, ZIP"
        />
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
          "Invite student"
        )}
      </Button>
    </form>
  );
}