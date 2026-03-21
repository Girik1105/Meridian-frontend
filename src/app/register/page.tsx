"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";
import { Compass, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordLongEnough = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    username.trim() && emailValid && passwordLongEnough && passwordsMatch && !loading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordLongEnough) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <p className="mt-2 text-slate font-body">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-silver/50 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-heading font-medium text-charcoal mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-silver px-4 py-2.5 text-ink font-body placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
              placeholder="Choose a username"
            />
          </div>

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

          <div>
            <label htmlFor="password" className="block text-sm font-heading font-medium text-charcoal mb-1.5">
              Password
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
              Confirm Password
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
                placeholder="Re-enter your password"
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
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate font-body">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
