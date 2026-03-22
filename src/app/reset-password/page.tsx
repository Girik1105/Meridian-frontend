"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/api";
import { Compass, Eye, EyeOff, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordLongEnough = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = passwordLongEnough && passwordsMatch && !loading;

  if (!uid || !token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="font-heading text-lg font-semibold text-ink">Invalid Reset Link</h2>
        <p className="text-sm text-charcoal font-body">
          This password reset link is invalid or incomplete. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm text-secondary font-medium hover:underline font-body"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword({ uid: uid!, token: token!, new_password: password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-lg font-semibold text-ink">Password reset!</h2>
        <p className="text-sm text-charcoal font-body">
          Your password has been updated. Redirecting you to sign in...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-secondary font-medium hover:underline font-body"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
          {error}
        </div>
      )}

      <p className="text-sm text-charcoal font-body">
        Enter your new password below.
      </p>

      <div>
        <label htmlFor="password" className="block text-sm font-heading font-medium text-charcoal mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-silver px-4 py-2.5 pr-11 text-ink font-body placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-charcoal transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {password && !passwordLongEnough && (
          <p className="mt-1 text-xs text-red-600">Password must be at least 8 characters.</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-heading font-medium text-charcoal mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-silver px-4 py-2.5 pr-11 text-ink font-body placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
            placeholder="Re-enter your new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-charcoal transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg bg-secondary text-white font-heading font-medium py-2.5 hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      <p className="text-center text-sm text-slate font-body">
        <Link href="/login" className="text-secondary font-medium hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-snow px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-primary">
            <Compass className="h-7 w-7 text-secondary" />
            Meridian
          </Link>
          <p className="mt-2 text-slate font-body">Choose a new password</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-silver/50 p-8">
          <Suspense fallback={<div className="text-center text-slate font-body text-sm">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
