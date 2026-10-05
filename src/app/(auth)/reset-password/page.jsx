"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Lock, ArrowRight, Eye, EyeOff, CheckCircle, KeyRound, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!resetToken) {
      setErrorMsg("Reset token is missing. Please check your email reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const result = await resetPassword(resetToken, newPassword);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || "Password reset failed. Token may be expired.");
      return;
    }

    setSuccessMsg("Password reset successfully! You can now log in with your new password.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {successMsg ? (
        <div className="space-y-4 text-center">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 space-y-2">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-sm text-emerald-900">Password Changed!</p>
            <p>{successMsg}</p>
          </div>
          <Link
            href="/login"
            className="block w-full text-center bg-[#0f1a3a] hover:bg-primary text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md"
          >
            Go to Sign In →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Reset Token
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Paste token from email"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f1a3a] text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Reset Password & Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="pt-3 text-center border-t border-slate-100">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#1d3bb5] text-white shadow-lg shadow-primary/30">
              <GraduationCap className="h-6 w-6 transition-transform group-hover:scale-110" />
            </div>
            <div className="text-left">
              <span className="block font-display text-xl font-bold tracking-tight text-white">
                EduSphere
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-gold uppercase -mt-1">
                Institutional SaaS
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose a new secure password for your account
          </p>
        </div>

        <Suspense fallback={<div className="bg-white p-8 rounded-2xl text-center text-xs">Loading reset page...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
