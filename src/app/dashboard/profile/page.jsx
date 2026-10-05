"use client";

import React, { useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import ProfileHeader from "@/components/pages/dashboard/profile/ProfileHeader";
import ProfileIdentity from "@/components/pages/dashboard/profile/ProfileIdentity";
import PersonalInfo from "@/components/pages/dashboard/profile/PersonalInfo";
import ProfessionalDetails from "@/components/pages/dashboard/profile/ProfessionalDetails";
import ProfileSecurity from "@/components/pages/dashboard/profile/ProfileSecurity";
import PasswordModal from "@/components/pages/dashboard/profile/PasswordModal";

import { ROLE_META, ROLE_SEED_DATA } from "@/components/pages/dashboard/profile/profile.utils";

// Backend roles are UPPERCASE (SUPER_ADMIN / SCHOOL / TEACHER / STUDENT); the
// profile seed data is keyed by display label. Map so the badge + placeholder
// meta resolve correctly instead of always falling through to "Principal".
const ROLE_KEY_MAP = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL: "Principal",
  TEACHER: "Teacher",
  STUDENT: "Teacher",
};

export default function ProfilePage() {
  const authUser = useAuthStore((state) => state.user);

  // While the store is hydrating, render a lightweight placeholder. Middleware
  // guarantees the user is authed by the time we get here in production.
  // NOTE: all stateful hooks live in <ProfileContent> so they only ever run
  // with a valid user — calling them here (before this guard) would violate
  // the Rules of Hooks the moment the store hydrates from null → user.
  if (!authUser) {
    return (
      <div className="max-w-8xl mx-auto pb-16 pt-2">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  return <ProfileContent authUser={authUser} />;
}

function ProfileContent({ authUser }) {
  const fileInputRef = useRef(null);
  const changePassword = useAuthStore((state) => state.changePassword);

  const role = ROLE_KEY_MAP[authUser.role] || "Principal";
  const seed = ROLE_SEED_DATA[role];
  const meta = ROLE_META[role];

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [form, setForm] = useState({
    fullName: authUser.name || seed.fullName,
    email: authUser.contactEmail || authUser.email || seed.email,
    phone: seed.phone,
    address: seed.address,
    bio: seed.bio,
  });
  const [saveState, setSaveState] = useState("idle");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showPw, setShowPw] = useState(false);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    const result = await changePassword(passwordForm.current, passwordForm.next);

    if (!result.success) {
      setPasswordError(result.error || "Failed to update password.");
      return;
    }

    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordError("");
    setPasswordOpen(false);
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-16 pt-2">
      <ProfileHeader saveState={saveState} handleSave={handleSave} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Avatar Banner Card & Read-only Meta Data */}
        <div className="lg:col-span-1 space-y-4">
          <ProfileIdentity
            form={form}
            role={role}
            meta={meta}
            avatarUrl={avatarUrl}
            fileInputRef={fileInputRef}
            handleAvatarChange={handleAvatarChange}
          />

          <ProfessionalDetails seed={seed} />

          <ProfileSecurity setPasswordOpen={setPasswordOpen} />
        </div>

        {/* Right Side: Primary Configuration Fields */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
            <PersonalInfo form={form} updateField={updateField} />
          </form>
        </div>
      </div>

      <PasswordModal
        passwordOpen={passwordOpen}
        setPasswordOpen={setPasswordOpen}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        passwordError={passwordError}
        showPw={showPw}
        setShowPw={setShowPw}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
