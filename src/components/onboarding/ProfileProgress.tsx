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
  { label: "Learning Style", keys: ["learning_style", "prefers_hands_on", "engagement_with_reading", "engagement_with_exercises"] },
];

function getSectionStatus(profileData: Record<string, unknown>, keys: string[]): "complete" | "partial" | "pending" {
  const found = keys.filter((key) => {
    if (key in profileData) return true;
    // Check nested: profileData.background.education_level
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
          <Check className="h-3.5 w-3.5 text-success" />
        </div>
      );
    case "partial":
      return (
        <div className="w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center">
          <Loader2 className="h-3.5 w-3.5 text-secondary animate-spin" />
        </div>
      );
    case "pending":
      return (
        <div className="w-6 h-6 rounded-full bg-cloud flex items-center justify-center">
          <Circle className="h-3.5 w-3.5 text-silver" />
        </div>
      );
  }
}

export default function ProfileProgress({ profileData }: ProfileProgressProps) {
  const [collapsed, setCollapsed] = useState(false);

  const statuses = SECTIONS.map((s) => getSectionStatus(profileData, s.keys));
  const completedCount = statuses.filter((s) => s === "complete").length;
  const progressPercent = (completedCount / SECTIONS.length) * 100;

  return (
    <div className="bg-white border border-silver/50 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 md:cursor-default"
      >
        <div>
          <h3 className="font-heading font-medium text-ink text-sm">Your Profile</h3>
          <p className="text-xs text-slate font-body mt-0.5">
            {completedCount} of {SECTIONS.length} sections complete
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate md:hidden transition-transform duration-200 ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </button>

      <div className={`${collapsed ? "hidden md:block" : ""}`}>
        {/* Progress bar */}
        <div className="px-5 pb-3">
          <div className="h-2 bg-cloud rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Section list */}
        <div className="px-5 pb-5 space-y-3">
          {SECTIONS.map((section, i) => (
            <div key={section.label} className="flex items-center gap-3">
              <StatusIcon status={statuses[i]} />
              <span
                className={`text-sm font-heading ${
                  statuses[i] === "complete"
                    ? "text-ink font-medium"
                    : statuses[i] === "partial"
                      ? "text-charcoal"
                      : "text-slate"
                }`}
              >
                {section.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
