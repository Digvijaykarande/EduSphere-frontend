"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PasswordModal({
  passwordOpen,
  setPasswordOpen,
  passwordForm,
  setPasswordForm,
  passwordError,
  showPw,
  setShowPw,
  handlePasswordSubmit,
}) {
  return (
    <Modal isOpen={passwordOpen} onClose={() => setPasswordOpen(false)}>
      <ModalContent maxWidth="max-w-sm">
        <ModalHeader>
          <ModalTitle>Change Password</ModalTitle>
        </ModalHeader>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
          {["current", "next", "confirm"].map((key) => (
            <div key={key} className="space-y-1.5">
              <Label>
                {key === "current"
                  ? "Current Password"
                  : key === "next"
                  ? "New Password"
                  : "Confirm New Password"}
              </Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={passwordForm[key]}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {passwordError && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {passwordError}
            </p>
          )}

          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
}