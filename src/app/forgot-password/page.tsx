"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";
import { Compass, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-snow px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-primary">
            <Compass className="h-7 w-7 text-secondary" />
            Meridian
          </Link>
          <p className="mt-2 text-slate font-body">Reset your password</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-silver/50 p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-heading text-lg font-semibold text-ink">Check your email</h2>
              <p className="text-sm text-charcoal font-body">
                If an account with <strong>{email}</strong> exists, we&apos;ve sent a link to reset your password. The link expires in 24 hours.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-secondary font-medium hover:underline font-body mt-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
                  {error}
                </div>
              )}

              <p className="text-sm text-charcoal font-body">
                Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
              </p>

              <div>
                <label htmlFor="email" className="block text-sm font-heading font-medium text-charcoal mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-ink font-body placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-colors ${
                    email && !emailValid ? "border-red-400 focus:border-red-400" : "border-silver focus:border-secondary"
                  }`}
                  placeholder="you@example.com"
                />
                {email && !emailValid && (
                  <p className="mt-1 text-xs text-red-600">Please enter a valid email address.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!emailValid || loading}
                className="w-full rounded-lg bg-secondary text-white font-heading font-medium py-2.5 hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-sm text-slate font-body">
                <Link href="/login" className="text-secondary font-medium hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
