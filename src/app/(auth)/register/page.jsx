"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Building,
  Globe,
  Hash,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const registerSchool = useAuthStore((s) => s.registerSchool);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCode: "",
    emailDomain: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const payload = {
      schoolName: formData.schoolName,
      schoolCode: formData.schoolCode.toUpperCase(),
      emailDomain: formData.emailDomain.toLowerCase(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    const result = await registerSchool(payload);
    setIsLoading(false);

    if (!result.success) {
      setFormError(result.error || "Registration failed.");
      return;
    }

    setSuccessMsg("School & Admin account created successfully! Redirecting to dashboard...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
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
            Register Institution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision a new school workspace & administrator account
          </p>
        </div>

        {/* Card Wrapper */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
          
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs text-blue-900">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              This form registers a <strong className="font-semibold">School / College Institution</strong>. Once registered, the School Admin can provision student and teacher accounts from the dashboard.
            </p>
          </div>

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
            {/* Institution Section */}
            <div className="space-y-4 pt-1">
              <h2 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                1. School Details
              </h2>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  School Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="IMED College Pune"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    School Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="IMEDPUNE"
                      value={formData.schoolCode}
                      onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email Domain
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="punecollege.com"
                      value={formData.emailDomain}
                      onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value.toLowerCase() })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Administrator Account Section */}
            <div className="space-y-4 pt-3">
              <h2 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                2. Admin Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Admin Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Director IMED"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="admin.imed@punecollege.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f1a3a] text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register School Workspace
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an institution account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}