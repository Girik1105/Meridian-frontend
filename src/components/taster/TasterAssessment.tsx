"use client";

import { useRouter } from "next/navigation";
import {
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import type { TasterAssessment as TasterAssessmentType } from "@/types/taster";

interface TasterAssessmentProps {
  assessment: TasterAssessmentType;
  skillName: string;
}

export default function TasterAssessment({
  assessment,
  skillName,
}: TasterAssessmentProps) {
  const router = useRouter();

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

        {/* Engagement signals */}
        {assessment.engagement_signals &&
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

        {/* Disclaimer */}
        <div
          className="bg-cloud rounded-xl p-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: "900ms" }}
        >
          <p className="font-body text-xs text-slate leading-relaxed">
            {assessment.disclaimer ||
              "This assessment is based on a 30-minute sample. A real career decision deserves more exploration. Cross-reference with professionals and career advisors."}
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 animate-fade-in-up"
          style={{ animationDelay: "1050ms" }}
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
