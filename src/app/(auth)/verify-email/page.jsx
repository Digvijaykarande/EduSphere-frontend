"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrateAfterVerify = useAuthStore((s) => s.hydrateAfterVerify);

  const id = searchParams.get("id") || "";
  const token = searchParams.get("token") || "";

  const [state, setState] = useState({ status: "verifying", message: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id || !token) {
        setState({
          status: "error",
          message:
            "This verification link is missing required parameters. Please use the link from your email.",
        });
        return;
      }
      try {
        // The backend sets the auth cookies on a successful verify and returns
        // 200 + user. We then hydrate the store and bounce to the dashboard.
        await api.verifyEmail({ id, token });
        const result = await hydrateAfterVerify();
        if (cancelled) return;
        if (!result.success) {
          setState({
            status: "error",
            message: "Verified, but failed to load your account. Try signing in manually.",
          });
          return;
        }
        setState({
          status: "success",
          message: "Email verified. Redirecting you to the dashboard…",
        });
        const t = setTimeout(() => router.replace("/dashboard"), 800);
        return () => clearTimeout(t);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "Verification failed. The link may be expired.";
        setState({ status: "error", message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, token, hydrateAfterVerify, router]);

  return (
    <Shell>
      {state.status === "verifying" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-700">
            Verifying your email…
          </p>
        </div>
      )}

      {state.status === "success" && (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <h2 className="text-base font-display font-bold text-slate-900">
            You're verified
          </h2>
          <p className="text-xs text-slate-500">{state.message}</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h2 className="text-base font-display font-bold text-slate-900">
            Verification failed
          </h2>
          <p className="text-xs text-slate-500">{state.message}</p>
          <Link
            href="/login"
            className="text-xs font-bold text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#1d3bb5] text-white shadow-lg shadow-primary/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="block font-display text-xl font-bold tracking-tight text-white">
                EduSphere
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-gold uppercase -mt-1">
                Email verification
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b1226]">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}