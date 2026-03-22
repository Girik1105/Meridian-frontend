"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Clock,
  BookOpen,
  Code,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Sparkles,
} from "lucide-react";
import type {
  TasterAssessment as TasterAssessmentType,
  TasterModule,
  TasterResponse,
} from "@/types/taster";

interface TasterAssessmentProps {
  assessment: TasterAssessmentType;
  skillName: string;
  modules?: TasterModule[];
  responses?: TasterResponse[];
}

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  read: BookOpen,
  exercise: Code,
  reflect: MessageSquare,
};

const TYPE_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  read: { bar: "bg-secondary", bg: "bg-secondary-light", text: "text-secondary" },
  exercise: { bar: "bg-accent", bg: "bg-accent-light", text: "text-accent" },
  reflect: { bar: "bg-primary", bg: "bg-primary-light", text: "text-primary" },
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export default function TasterAssessment({
  assessment,
  skillName,
  modules,
  responses,
}: TasterAssessmentProps) {
  const router = useRouter();

  // Build per-module engagement data
  const engagementData = useMemo(() => {
    if (!modules || !responses || responses.length === 0) return null;

    const responseMap = new Map(responses.map((r) => [r.module_id, r]));
    const items = modules.map((mod) => {
      const resp = responseMap.get(mod.id);
      return {
        title: mod.title,
        type: mod.type,
        timeSpent: resp?.time_spent_seconds ?? 0,
        estimatedMinutes: mod.estimated_minutes,
        hasResponse: !!resp,
      };
    });

    const totalTime = items.reduce((sum, it) => sum + it.timeSpent, 0);
    const maxTime = Math.max(...items.map((it) => it.timeSpent), 1);
    const avgTime = items.length > 0 ? totalTime / items.length : 0;

    // Time by module type
    const byType: Record<string, { total: number; count: number }> = {};
    items.forEach((it) => {
      if (!byType[it.type]) byType[it.type] = { total: 0, count: 0 };
      byType[it.type].total += it.timeSpent;
      byType[it.type].count += 1;
    });

    return { items, totalTime, maxTime, avgTime, byType };
  }, [modules, responses]);

  // Derive overall engagement level from signals or time data
  const overallEngagement = assessment.engagement_signals?.overall_engagement as
    | string
    | undefined;

  const engagementColor =
    overallEngagement === "high"
      ? "text-success"
      : overallEngagement === "moderate"
        ? "text-secondary"
        : "text-accent";

  const engagementBg =
    overallEngagement === "high"
      ? "bg-success-light"
      : overallEngagement === "moderate"
        ? "bg-secondary-light"
        : "bg-accent-light";

  const engagementPercent =
    overallEngagement === "high"
      ? 85
      : overallEngagement === "moderate"
        ? 55
        : 25;

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-light mb-4">
            <BarChart3 className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-ink mb-1">
            Your Assessment
          </h1>
          <p className="font-body text-sm text-slate">
            Here&apos;s what we observed from your {skillName} taster
          </p>
        </div>

        {/* Summary */}
        <div
          className="bg-white rounded-2xl border border-secondary/30 p-5 shadow-sm mb-6 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <p className="font-body text-sm text-charcoal leading-relaxed">
            {assessment.summary}
          </p>
        </div>

        {/* Strengths */}
        {assessment.strengths.length > 0 && (
          <div
            className="mb-6 animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate mb-3">
              Strengths
            </h2>
            <div className="space-y-2">
              {assessment.strengths.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-success-light rounded-xl p-3"
                >
                  <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-charcoal">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friction points */}
        {assessment.friction_points.length > 0 && (
          <div
            className="mb-6 animate-fade-in-up"
            style={{ animationDelay: "450ms" }}
          >
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate mb-3">
              Areas to Explore
            </h2>
            <div className="space-y-2">
              {assessment.friction_points.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-accent-light rounded-xl p-3"
                >
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-charcoal">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Analysis */}
        <div
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate mb-3">
            Engagement Analysis
          </h2>

          <div className="bg-white rounded-2xl border border-silver/50 shadow-sm overflow-hidden">
            {/* Top stats row */}
            <div className="grid grid-cols-3 divide-x divide-silver/50 border-b border-silver/50">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5 text-slate" />
                  <span className="text-xs font-heading text-slate">Total Time</span>
                </div>
                <p className="font-heading text-lg font-bold text-ink">
                  {engagementData ? formatTime(engagementData.totalTime) : "--"}
                </p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Activity className="h-3.5 w-3.5 text-slate" />
                  <span className="text-xs font-heading text-slate">Avg / Module</span>
                </div>
                <p className="font-heading text-lg font-bold text-ink">
                  {engagementData
                    ? formatTime(Math.round(engagementData.avgTime))
                    : "--"}
                </p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-slate" />
                  <span className="text-xs font-heading text-slate">Engagement</span>
                </div>
                <p className={`font-heading text-lg font-bold capitalize ${engagementColor}`}>
                  {overallEngagement || "--"}
                </p>
              </div>
            </div>

            {/* Time per module bar chart */}
            {engagementData && (
              <div className="p-5">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate mb-4">
                  Time Spent per Module
                </h3>
                <div className="space-y-3">
                  {engagementData.items.map((item, i) => {
                    const barPercent = Math.max(
                      (item.timeSpent / engagementData.maxTime) * 100,
                      2
                    );
                    const colors = TYPE_COLORS[item.type] || TYPE_COLORS.read;
                    const Icon = TYPE_ICONS[item.type] || BookOpen;

                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${colors.bg}`}
                            >
                              <Icon className={`h-3 w-3 ${colors.text}`} />
                            </div>
                            <span className="text-xs font-heading font-medium text-charcoal truncate">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-semibold text-slate ml-2 shrink-0">
                            {formatTime(item.timeSpent)}
                          </span>
                        </div>
                        <div className="h-2.5 bg-cloud rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
                            style={{ width: `${barPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Engagement by type breakdown */}
            {engagementData && Object.keys(engagementData.byType).length > 1 && (
              <div className="px-5 pb-5 border-t border-silver/50 pt-4">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate mb-3">
                  Time by Activity Type
                </h3>
                <div className="flex gap-3">
                  {Object.entries(engagementData.byType).map(([type, data]) => {
                    const colors = TYPE_COLORS[type] || TYPE_COLORS.read;
                    const Icon = TYPE_ICONS[type] || BookOpen;
                    const typeTotal = Object.values(engagementData.byType).reduce(
                      (s, d) => s + d.total,
                      0
                    );
                    const percent =
                      typeTotal > 0
                        ? Math.round((data.total / typeTotal) * 100)
                        : 0;

                    return (
                      <div
                        key={type}
                        className={`flex-1 rounded-xl p-3 ${colors.bg}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
                          <span
                            className={`text-xs font-heading font-semibold capitalize ${colors.text}`}
                          >
                            {type}
                          </span>
                        </div>
                        <p className="font-heading text-lg font-bold text-ink">
                          {percent}%
                        </p>
                        <p className="text-xs font-heading text-slate">
                          {formatTime(data.total)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Overall engagement gauge */}
            {overallEngagement && (
              <div className="px-5 pb-5 border-t border-silver/50 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate">
                    Overall Engagement Level
                  </span>
                  <span
                    className={`text-xs font-heading font-bold capitalize ${engagementColor}`}
                  >
                    {overallEngagement}
                  </span>
                </div>
                <div className="h-3 bg-cloud rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      overallEngagement === "high"
                        ? "bg-success"
                        : overallEngagement === "moderate"
                          ? "bg-secondary"
                          : "bg-accent"
                    }`}
                    style={{ width: `${engagementPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] font-heading text-slate">Low</span>
                  <span className="text-[10px] font-heading text-slate">Moderate</span>
                  <span className="text-[10px] font-heading text-slate">High</span>
                </div>
              </div>
            )}

            {/* Highlight signals from Claude that aren't covered above */}
            {assessment.engagement_signals && (() => {
              const extraSignals = Object.entries(assessment.engagement_signals).filter(
                ([key]) => key !== "overall_engagement" && key !== "most_time_spent" && key !== "least_time_spent"
              );
              if (extraSignals.length === 0) return null;
              return (
                <div className="px-5 pb-5 border-t border-silver/50 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {extraSignals.map(([key, val]) => {
                      const isPositive =
                        key.includes("strength") ||
                        key.includes("high") ||
                        key.includes("engaged");
                      return (
                        <span
                          key={key}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-medium ${
                            isPositive
                              ? "bg-success-light text-success"
                              : "bg-primary-light text-primary"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {key.replace(/_/g, " ")}:{" "}
                          <span className="font-mono font-semibold">{val}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* No module data fallback — show original pills */}
        {!engagementData &&
          assessment.engagement_signals &&
          Object.keys(assessment.engagement_signals).length > 0 && (
            <div
              className="mb-6 animate-fade-in-up"
              style={{ animationDelay: "600ms" }}
            >
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate mb-3">
                Engagement Signals
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(assessment.engagement_signals).map(
                  ([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-heading font-medium"
                    >
                      {key.replace(/_/g, " ")}:{" "}
                      <span className="font-mono font-semibold">{val}</span>
                    </span>
                  )
                )}
              </div>
            </div>
          )}

        {/* Next steps */}
        {assessment.next_steps.length > 0 && (
          <div
            className="mb-6 animate-fade-in-up"
            style={{ animationDelay: "750ms" }}
          >
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate mb-3">
              Suggested Next Steps
            </h2>
            <div className="bg-white rounded-2xl border border-silver/50 p-5 shadow-sm">
              <ol className="space-y-3">
                {assessment.next_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-light text-secondary text-xs font-heading font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="font-body text-sm text-charcoal">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Learning Plan */}
        {assessment.learning_plan && assessment.learning_plan.phases.length > 0 && (
          <div
            className="mb-6 animate-fade-in-up"
            style={{ animationDelay: "850ms" }}
          >
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate mb-1">
              Your Learning Roadmap
            </h2>
            <p className="font-body text-xs text-charcoal mb-4">
              {assessment.learning_plan.summary}
            </p>

            <div className="space-y-4">
              {assessment.learning_plan.phases.map((phase, phaseIdx) => (
                <div
                  key={phaseIdx}
                  className="bg-white rounded-2xl border border-silver/50 shadow-sm overflow-hidden"
                >
                  {/* Phase header */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-silver/50 bg-cloud/50">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-bold text-white ${
                      phaseIdx === 0 ? "bg-secondary" : phaseIdx === 1 ? "bg-accent" : "bg-primary"
                    }`}>
                      {phaseIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-sm font-semibold text-ink">
                        {phase.title}
                      </h3>
                      <p className="text-xs font-heading text-slate">
                        Weeks {phase.weeks} &middot; {phase.goal}
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="p-4 space-y-2.5">
                    {phase.resources.map((resource, resIdx) => (
                      <a
                        key={resIdx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-cloud transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary-light flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm font-medium text-ink group-hover:text-secondary transition-colors truncate">
                            {resource.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-heading text-slate">
                              {resource.provider}
                            </span>
                            <span className="text-xs font-heading text-slate">&middot;</span>
                            <span className="text-xs font-heading text-slate">
                              ~{resource.estimated_hours}h
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-heading font-medium flex-shrink-0 ${
                          resource.cost === "Free"
                            ? "bg-success-light text-success"
                            : "bg-cloud text-slate"
                        }`}>
                          {resource.cost}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div className="flex items-center gap-4 mt-3 px-1">
              <span className="text-xs font-heading text-slate flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{assessment.learning_plan.total_estimated_weeks} weeks total
              </span>
              <span className="text-xs font-heading text-slate flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {assessment.learning_plan.total_estimated_cost}
              </span>
            </div>

            {/* Ethical footer */}
            <p className="text-xs font-body text-slate italic mt-3">
              Resources curated by AI based on your profile, budget, and learning style. Verify availability and current pricing before enrolling.
            </p>
          </div>
        )}

        {/* Community Mentor Matching — Coming Soon */}
        <div
          className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-silver p-5 animate-fade-in-up"
          style={{ animationDelay: "950ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-secondary" />
            <h2 className="font-heading text-sm font-semibold text-ink">
              Connect with a Real Mentor
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-light text-accent text-xs font-heading font-medium ml-auto">
              <Sparkles className="h-3 w-3" />
              Coming Soon
            </span>
          </div>

          <div className="opacity-60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {[
                { initials: "SK", name: "Sarah Kim", role: "Senior Data Analyst", company: "Deloitte", color: "bg-secondary" },
                { initials: "MR", name: "Marcus Rivera", role: "Analytics Lead", company: "HoneyBee Health", color: "bg-primary" },
              ].map((mentor) => (
                <div key={mentor.initials} className="bg-cloud rounded-xl p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full ${mentor.color} text-white flex items-center justify-center text-sm font-heading font-bold`}>
                      {mentor.initials}
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-ink">{mentor.name}</p>
                      <p className="text-xs font-body text-slate">{mentor.role} &middot; {mentor.company}</p>
                    </div>
                  </div>
                  <p className="text-xs font-heading text-slate mb-2">5 years experience</p>
                  <button
                    disabled
                    className="w-full py-2 rounded-lg bg-silver/30 text-slate font-heading text-xs font-medium cursor-not-allowed"
                  >
                    Request Introduction
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-body text-slate italic mt-3">
            AI-matched mentors based on your career path, location, and skill interests
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="bg-cloud rounded-xl p-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: "1100ms" }}
        >
          <p className="font-body text-xs text-slate leading-relaxed">
            {assessment.disclaimer ||
              "This assessment is based on a 30-minute sample. A real career decision deserves more exploration. Cross-reference with professionals and career advisors."}
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 animate-fade-in-up"
          style={{ animationDelay: "1250ms" }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cloud text-charcoal font-heading font-medium text-sm hover:bg-silver/30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => router.push("/tasters")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors"
          >
            Try Another Skill
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
