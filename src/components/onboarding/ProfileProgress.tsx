"use client";

import { Check, Circle, Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ProfileProgressProps {
  profileData: Record<string, unknown>;
}

interface Section {
  label: string;
  keys: string[];
}

const SECTIONS: Section[] = [
  { label: "Background", keys: ["background", "education_level", "current_role", "field_of_study", "years_experience"] },
  { label: "Interests", keys: ["interests"] },
  { label: "Constraints", keys: ["constraints", "hours_per_week", "budget", "timeline_months", "location"] },
  { label: "Preferences", keys: ["career_preferences", "confidence_level", "explored_paths", "leaning_toward", "deal_breakers"] },
  { label: "Learning", keys: ["learning_style", "prefers_hands_on", "engagement_with_reading", "engagement_with_exercises"] },
];

function getSectionStatus(profileData: Record<string, unknown>, keys: string[]): "complete" | "partial" | "pending" {
  const found = keys.filter((key) => {
    if (key in profileData) return true;
    for (const val of Object.values(profileData)) {
      if (val && typeof val === "object" && key in (val as Record<string, unknown>)) return true;
    }
    return false;
  });
  if (found.length === 0) return "pending";
  if (found.length >= Math.ceil(keys.length / 2)) return "complete";
  return "partial";
}

function StatusIcon({ status }: { status: "complete" | "partial" | "pending" }) {
  switch (status) {
    case "complete":
      return (
        <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center">
          <Check className="h-3 w-3 text-success" />
        </div>
      );
    case "partial":
      return (
        <div className="w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center">
          <Loader2 className="h-3 w-3 text-secondary animate-spin" />
        </div>
      );
    case "pending":
      return (
        <div className="w-6 h-6 rounded-full bg-cloud flex items-center justify-center">
          <Circle className="h-3 w-3 text-silver" />
        </div>
      );
  }
}

export default function ProfileProgress({ profileData }: ProfileProgressProps) {
  const [expanded, setExpanded] = useState(false);

  const statuses = SECTIONS.map((s) => getSectionStatus(profileData, s.keys));
  const completedCount = statuses.filter((s) => s === "complete").length;
  const progressPercent = (completedCount / SECTIONS.length) * 100;

  return (
    <div className="border-b border-silver/50 bg-white">
      <div className="mx-auto max-w-3xl px-3 md:px-6">
        {/* Compact bar — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-4 py-2.5 md:cursor-default"
        >
          {/* Horizontal indicators */}
          <div className="hidden md:flex items-center gap-3">
            {SECTIONS.map((section, i) => (
              <div key={section.label} className="flex items-center gap-1.5">
                <StatusIcon status={statuses[i]} />
                <span className={`text-xs font-heading ${
                  statuses[i] === "complete" ? "text-ink font-medium" :
                  statuses[i] === "partial" ? "text-charcoal" : "text-slate"
                }`}>
                  {section.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile: compact summary */}
          <div className="md:hidden flex items-center gap-3 flex-1">
            <div className="flex-1">
              <div className="h-1.5 bg-cloud rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-slate font-heading whitespace-nowrap">
              {completedCount}/{SECTIONS.length}
            </span>
            <ChevronDown className={`h-4 w-4 text-slate transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </div>

          {/* Desktop: progress bar */}
          <div className="hidden md:block flex-1 max-w-24">
            <div className="h-1.5 bg-cloud rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </button>

        {/* Mobile expanded detail */}
        {expanded && (
          <div className="md:hidden pb-3 flex flex-wrap gap-2">
            {SECTIONS.map((section, i) => (
              <div key={section.label} className="flex items-center gap-1.5">
                <StatusIcon status={statuses[i]} />
                <span className={`text-xs font-heading ${
                  statuses[i] === "complete" ? "text-ink font-medium" :
                  statuses[i] === "partial" ? "text-charcoal" : "text-slate"
                }`}>
                  {section.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
