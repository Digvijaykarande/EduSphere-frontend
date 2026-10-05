import React from "react";
import { inputClass } from "./profile.utils";

export default function PersonalInfo({ form, updateField }) {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Personal Details
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Update your public profile configuration preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Full Name
          </label>
          <input
            className={inputClass}
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Email Address
          </label>
          <input
            className={`${inputClass} bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 cursor-not-allowed`}
            value={form.email}
            disabled
          />
        </div>

        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Phone Number
          </label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Residential Address
          </label>
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Short Biography
          </label>
          <textarea
            rows={4}
            className={`${inputClass} resize-none`}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}