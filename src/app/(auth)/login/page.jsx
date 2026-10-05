"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const fromPath = searchParams.get("from") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    setIsLoading(true);

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (!result.success) {
      setFormError(result.error || "Invalid email or password.");
      return;
    }

    setSuccessMsg("Authentication successful! Redirecting to dashboard...");
    setTimeout(() => {
      router.replace(fromPath);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
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
            Portal Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log in to manage your academic profile & dashboard
          </p>
        </div>

        {/* Card Wrapper */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {formError}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / alias Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Login ID or personal email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="edna.krabappel.a3f9k1b4@edusphere.app"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                Use the alias we emailed you, or your personal / parent email.
              </p>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f1a3a] text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Want to register your school institution?{" "}
              <Link
                href="/register"
                className="font-bold text-primary hover:underline"
              >
                Register School
              </Link>
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              256-Bit Encrypted Institutional Access
            </span>
          </div>
        </div>

        {/* Return to Home link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4">
          <span className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}