"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/api";
import {
  Compass,
  LogOut,
  UserCircle,
  Map,
  FlaskConical,
  Check,
  Lock,
  ArrowRight,
} from "lucide-react";
import { OnboardingFlow } from "@/components/onboarding";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, refetch } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleOnboardingComplete = useCallback(() => {
    refetch();
  }, [refetch]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-8 w-8 text-secondary animate-spin" />
          <span className="text-slate font-body text-sm">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const onboardingDone = user.profile.onboarding_completed;
  const stage = user.profile.journey_stage;

  const STAGE_ORDER = ["onboarding", "career_discovery", "skill_taster"];
  const stageIndex = STAGE_ORDER.indexOf(stage);

  function stepStatus(unlockStage: number): "complete" | "active" | "locked" {
    if (stageIndex > unlockStage) return "complete";
    if (stageIndex === unlockStage) return "active";
    return "locked";
  }

  const steps = [
    {
      step: 1,
      title: "Build Your Profile",
      description: stageIndex > 0
        ? "Your profile is ready. Your mentor knows your background, goals, and constraints."
        : "Have a quick chat with your AI mentor to map your background, interests, and goals.",
      icon: UserCircle,
      status: stepStatus(0),
      action: stageIndex === 0 ? "Start Chat" : undefined,
    },
    {
      step: 2,
      title: "Discover Career Paths",
      description:
        "Get 2\u20133 personalized career paths with salary ranges, timelines, and ROI data.",
      icon: Map,
      status: stepStatus(1),
      action: stageIndex >= 1 ? "Explore Paths" : undefined,
    },
    {
      step: 3,
      title: "Try Skill Tasters",
      description:
        "Test-drive a skill in 30 minutes before committing to a full learning path.",
      icon: FlaskConical,
      status: stepStatus(2),
      action: stageIndex >= 2 ? "Try a Taster" : undefined,
    },
  ];

  return (
    <div className="h-screen bg-snow flex flex-col overflow-hidden">
      <header className="bg-white border-b border-silver/50 flex-shrink-0">
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

      {!onboardingDone ? (
        <OnboardingFlow
          username={user.username}
          onComplete={handleOnboardingComplete}
        />
      ) : (
        <main className="mx-auto max-w-6xl w-full px-4 py-12 md:px-8 flex-1 overflow-y-auto">
          <div className="mb-10">
            <h1 className="font-heading text-2xl font-bold text-ink">
              Welcome back, {user.username}
            </h1>
            <p className="mt-2 text-slate font-body">
              Your AI career mentor is ready to help you explore new paths.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              const isLocked = s.status === "locked";
              const isComplete = s.status === "complete";
              const isActive = s.status === "active";

              return (
                <div
                  key={s.step}
                  className={`relative rounded-2xl border p-6 shadow-sm transition-all ${
                    isLocked
                      ? "bg-cloud/60 border-silver/40 opacity-60"
                      : isComplete
                        ? "bg-white border-success/30 shadow-success/5"
                        : "bg-white border-secondary/30 shadow-secondary/5 hover:shadow-md hover:border-secondary/50"
                  }`}
                >
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider ${
                        isComplete
                          ? "text-success"
                          : isActive
                            ? "text-secondary"
                            : "text-slate"
                      }`}
                    >
                      Step {s.step}
                    </span>

                    {isComplete && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-0.5 text-xs font-heading font-medium text-success">
                        <Check className="h-3 w-3" />
                        Done
                      </span>
                    )}
                    {isLocked && (
                      <Lock className="h-4 w-4 text-slate" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isComplete
                        ? "bg-success-light"
                        : isActive
                          ? "bg-secondary-light"
                          : "bg-cloud"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isComplete
                          ? "text-success"
                          : isActive
                            ? "text-secondary"
                            : "text-slate"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <h2
                    className={`font-heading font-semibold text-lg mb-2 ${
                      isLocked ? "text-slate" : "text-ink"
                    }`}
                  >
                    {s.title}
                  </h2>
                  <p
                    className={`text-sm font-body leading-relaxed mb-5 ${
                      isLocked ? "text-slate/70" : "text-charcoal"
                    }`}
                  >
                    {s.description}
                  </p>

                  {/* Action button */}
                  {s.action && !isLocked && (
                    <button
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-heading font-medium text-sm transition-colors ${
                        isComplete
                          ? "bg-cloud text-charcoal hover:bg-silver/30"
                          : "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                      }`}
                    >
                      {s.action}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  {isLocked && (
                    <div className="w-full py-2.5 rounded-xl bg-cloud text-center text-sm font-heading font-medium text-slate">
                      Complete previous steps first
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}
    </div>
  );
}
