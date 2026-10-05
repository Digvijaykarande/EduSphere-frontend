import React from "react";
import { Save, ChevronRight } from "lucide-react";

export default function ProfileHeader({ saveState, handleSave }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      {/* <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
          Dashboard <ChevronRight size={13} /> Profile
        </p>
      </div> */}
      {/* <button
        onClick={handleSave}
        className="btn-pill-primary w-full sm:w-auto !px-6 !py-2.5 text-sm gap-2 justify-center transition-all"
      >
        <Save size={16} /> {saveState === "saved" ? "Saved Successfully" : "Save Changes"}
      </button> */}
    </div>
  );
}