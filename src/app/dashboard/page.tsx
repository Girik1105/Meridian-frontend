"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/api";
import { Compass, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-8 w-8 text-secondary animate-spin" />
          <span className="text-slate font-body text-sm">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-snow">
      <header className="bg-white border-b border-silver/50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary">
            <Compass className="h-6 w-6 text-secondary" />
            Meridian
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-charcoal font-body">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink font-heading font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <h1 className="font-heading text-2xl font-bold text-ink">
          Welcome back, {user.username}
        </h1>
        <p className="mt-2 text-slate font-body">
          Your AI career mentor is ready to help you explore new paths.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-xl border border-silver/50 p-6 shadow-sm">
            <h2 className="font-heading font-medium text-ink">Profile</h2>
            <p className="mt-1 text-sm text-slate font-body">
              Onboarding {user.profile.onboarding_completed ? "complete" : "not started"}
            </p>
            <p className="mt-0.5 text-sm text-slate font-body">
              Profile version: {user.profile.profile_version}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-silver/50 p-6 shadow-sm">
            <h2 className="font-heading font-medium text-ink">Career Paths</h2>
            <p className="mt-1 text-sm text-slate font-body">
              Complete onboarding to discover career paths tailored to you.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-silver/50 p-6 shadow-sm">
            <h2 className="font-heading font-medium text-ink">Skill Tasters</h2>
            <p className="mt-1 text-sm text-slate font-body">
              Try 30-minute crash courses before committing to a new skill.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
