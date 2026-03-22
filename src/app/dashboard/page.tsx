"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  GraduationCap,
  Sparkles,
  Target,
  Clock,
  Calendar,
  ChevronDown,
  Brain,
} from "lucide-react";
import { OnboardingFlow } from "@/components/onboarding";

function MentorContextBanner({
  profileData,
  stage,
}: {
  profileData: Record<string, unknown>;
  stage: string;
}) {
  const interests = profileData.interests as string[] | undefined;
  const constraints = profileData.constraints as Record<string, unknown> | undefined;
  const preferences = profileData.career_preferences as Record<string, unknown> | undefined;
  const leaningToward = preferences?.leaning_toward as string | undefined;

  let contextMessage = "";
  let actionHint = "";
  let actionHref = "";

  if (stage === "career_discovery") {
    const interestSnippet = interests && interests.length > 0
      ? ` You mentioned interest in ${interests.slice(0, 2).join(" and ")}.`
      : "";
    const timeSnippet = constraints?.timeline_months
      ? `With your ${constraints.timeline_months}-month timeline,`
      : "Based on your profile,";

    contextMessage = `${timeSnippet} let's find career paths that fit your situation.${interestSnippet}`;
    actionHint = "Explore your personalized career paths";
    actionHref = "/career-paths";
  } else if (stage === "skill_taster") {
    const leanSnippet = leaningToward
      ? `You chose to explore ${leaningToward}.`
      : "You've selected a career path.";

    contextMessage = `${leanSnippet} Time to test-drive the key skills with a 30-minute hands-on taster.`;
    actionHint = "Try your first skill taster";
    actionHref = "/tasters";
  } else {
    return null;
  }

  if (!contextMessage) return null;

  return (
    <div className="bg-secondary-light/50 border border-secondary/20 rounded-xl px-5 py-3.5 mb-6 flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      <Brain className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-heading text-xs font-semibold text-secondary uppercase tracking-wider">
            Your Mentor
          </span>
        </div>
        <p className="font-body text-sm text-charcoal leading-relaxed">
          {contextMessage}
        </p>
        {actionHint && (
          <a
            href={actionHref}
            className="mt-2 inline-flex items-center gap-1 text-xs font-heading font-semibold text-secondary hover:text-secondary/80 transition-colors"
          >
            {actionHint}
            <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

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

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const profileData = (user.profile.profile_data ?? {}) as Record<string, unknown>;

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

  // --- Profile snapshot chips ---
  const bg = profileData.background as Record<string, unknown> | undefined;
  const constraints = profileData.constraints as Record<string, unknown> | undefined;
  const interests = profileData.interests as string[] | undefined;
  const confidence = profileData.confidence_level as number | undefined;

  const chips: { icon: typeof Clock; label: string; value: string }[] = [];
  if (bg?.education_level) {
    chips.push({ icon: GraduationCap, label: "Education", value: String(bg.education_level) });
  }
  if (interests && interests.length > 0) {
    const display = interests.slice(0, 3).join(", ");
    chips.push({ icon: Sparkles, label: "Interests", value: display });
  }
  if (typeof confidence === "number") {
    chips.push({ icon: Target, label: "Confidence", value: `${confidence}/10` });
  }
  if (constraints?.timeline_months) {
    chips.push({ icon: Clock, label: "Timeline", value: `${constraints.timeline_months} months` });
  }
  if (constraints?.hours_per_week) {
    chips.push({ icon: Calendar, label: "Available", value: `${constraints.hours_per_week} hrs/week` });
  }

  return (
    <div className="h-screen bg-snow flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="bg-white border-b border-silver/50 flex-shrink-0">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-lg text-primary hover:opacity-80 transition-opacity"
          >
            <Compass className="h-6 w-6 text-secondary" />
            Meridian
          </Link>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-cloud transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-heading font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm text-charcoal font-body hidden sm:inline">
                {user.username}
              </span>
              <ChevronDown className={`h-4 w-4 text-slate transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-silver/50 shadow-lg py-1 z-50 animate-fade-in-up">
                <div className="px-4 py-2.5 border-b border-silver/50">
                  <p className="text-sm font-heading font-semibold text-ink truncate">
                    {user.username}
                  </p>
                  <p className="text-xs font-body text-slate truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-heading font-medium text-slate hover:text-ink hover:bg-cloud transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {!onboardingDone ? (
        <OnboardingFlow
          username={user.username}
          onComplete={handleOnboardingComplete}
        />
      ) : (
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl w-full px-4 md:px-8">
            {/* Hero welcome banner */}
            <div className="relative bg-gradient-to-r from-primary-light via-primary-light/60 to-snow rounded-2xl p-6 md:p-8 mt-6 mb-8 overflow-hidden">
              <div className="relative z-10">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink">
                  Welcome back, {user.username}
                </h1>
                <p className="mt-2 text-slate font-body max-w-lg">
                  Your AI career mentor is ready to help you explore new paths.
                </p>
              </div>
              <Compass className="absolute right-6 top-1/2 -translate-y-1/2 h-24 w-24 text-primary/10 animate-float hidden md:block" />
            </div>

            {/* Mentor context banner */}
            <MentorContextBanner
              profileData={profileData}
              stage={stage}
            />

            {/* Progress track */}
            <div className="flex items-center mb-6 px-2">
              {steps.map((s, i) => {
                const status = s.status;
                return (
                  <div key={s.step} className="flex items-center flex-1 last:flex-none">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-bold shrink-0 ${
                        status === "complete"
                          ? "bg-success text-white"
                          : status === "active"
                            ? "bg-secondary text-white"
                            : "bg-silver/40 text-slate"
                      }`}
                    >
                      {status === "complete" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        s.step
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`flex-1 mx-2 border-t-2 border-dashed ${
                          stageIndex > i ? "border-success" : "border-silver/50"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step cards */}
            <div className="grid gap-6 md:grid-cols-3 items-start">
              {steps.map((s) => {
                const Icon = s.icon;
                const isLocked = s.status === "locked";
                const isComplete = s.status === "complete";
                const isActive = s.status === "active";

                return (
                  <div
                    key={s.step}
                    className={`relative rounded-2xl border p-7 md:p-8 min-h-[280px] flex flex-col transition-all duration-300 ${
                      isLocked
                        ? "bg-white/60 backdrop-blur-sm border-silver/30 opacity-70"
                        : isComplete
                          ? "bg-cloud/80 border-silver/30"
                          : "bg-white border-secondary/40 shadow-lg shadow-secondary/10 ring-1 ring-secondary/10 md:scale-[1.02] z-10"
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
                        <Lock className="h-5 w-5 text-slate/60" />
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
                      className={`text-sm font-body leading-relaxed mb-auto ${
                        isLocked ? "text-slate/70" : isComplete ? "text-slate" : "text-charcoal"
                      }`}
                    >
                      {s.description}
                    </p>

                    {/* Action button */}
                    <div className="mt-5">
                      {s.action && !isLocked && (
                        <button
                          onClick={() => {
                            if (s.step === 2 && (isActive || isComplete)) {
                              router.push("/career-paths");
                            }
                            if (s.step === 3 && (isActive || isComplete)) {
                              router.push("/tasters");
                            }
                          }}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-medium text-sm transition-all ${
                            isComplete
                              ? "bg-cloud text-charcoal hover:bg-silver/30"
                              : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25"
                          }`}
                        >
                          {s.action}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}

                      {isLocked && (
                        <div className="w-full py-3 rounded-xl bg-cloud/60 text-center text-sm font-heading font-medium text-slate/70">
                          Complete previous steps first
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Profile snapshot */}
            {chips.length > 0 && (
              <div className="mt-10 mb-8 bg-white rounded-2xl border border-silver/50 p-6">
                <h3 className="font-heading text-xs text-slate uppercase tracking-wider font-semibold mb-4">
                  Your Profile Snapshot
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {chips.map((chip) => {
                    const ChipIcon = chip.icon;
                    return (
                      <span
                        key={chip.label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cloud text-sm font-heading text-charcoal"
                      >
                        <ChipIcon className="h-3.5 w-3.5 text-slate" />
                        <span className="text-slate font-normal">{chip.label}:</span>
                        {chip.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
