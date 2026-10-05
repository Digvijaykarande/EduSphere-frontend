import React from "react";
import { Lock } from "lucide-react";

export default function ProfileSecurity({ setPasswordOpen }) {
  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:"5px"}}>
      <div>
        <p className="text-base font-display font-semibold text-foreground">Password & Security</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Update your account password and security settings.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setPasswordOpen(true)}
        className="btn-pill-outline w-full sm:w-auto justify-center !px-5 !py-2.5 text-sm gap-2 shrink-0"
        style={{color:"black",background:"#dbeafe"}}
      >
        <Lock size={15} /> Change Password
      </button>
    </div>
  );
}