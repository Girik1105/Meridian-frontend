"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";

interface CompletionScreenProps {
  profileData: Record<string, unknown>;
  username: string;
}

function ProfileSummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-silver/30 last:border-0">
      <span className="text-sm text-slate font-heading">{label}</span>
      <span className="text-sm text-ink font-body text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function extractSummary(data: Record<string, unknown>): { label: string; value: string }[] {
  const items: { label: string; value: string }[] = [];

  const bg = data.background as Record<string, unknown> | undefined;
  if (bg?.education_level) items.push({ label: "Education", value: String(bg.education_level) });
  if (bg?.current_role) items.push({ label: "Current role", value: String(bg.current_role) });
  if (bg?.field_of_study) items.push({ label: "Field of study", value: String(bg.field_of_study) });

  const interests = data.interests;
  if (Array.isArray(interests) && interests.length > 0) {
    items.push({ label: "Interests", value: interests.join(", ") });
  }

  if (data.confidence_level) {
    items.push({ label: "Confidence", value: `${data.confidence_level}/10` });
  }

  const constraints = data.constraints as Record<string, unknown> | undefined;
  if (constraints?.hours_per_week) items.push({ label: "Hours/week", value: String(constraints.hours_per_week) });
  if (constraints?.budget) items.push({ label: "Budget", value: String(constraints.budget) });
  if (constraints?.timeline_months) items.push({ label: "Timeline", value: `${constraints.timeline_months} months` });

  const prefs = data.career_preferences as Record<string, unknown> | undefined;
  if (prefs?.leaning_toward) items.push({ label: "Leaning toward", value: String(prefs.leaning_toward) });

  return items;
}

export default function CompletionScreen({ profileData, username }: CompletionScreenProps) {
  const summaryItems = extractSummary(profileData);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        {/* Animated checkmark */}
        <div className="mx-auto w-20 h-20 rounded-full bg-success-light flex items-center justify-center mb-6 relative">
          <Check className="h-10 w-10 text-success" strokeWidth={3} />
          <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="font-heading text-2xl font-bold text-ink">Profile Complete!</h2>
        </div>

        <p className="text-slate font-body mb-8">
          Great work, {username}. Your AI mentor now has a clear picture of where you are
          and where you want to go.
        </p>

        {/* Profile summary card */}
        {summaryItems.length > 0 && (
          <div className="bg-white border border-silver/50 rounded-xl p-5 shadow-sm text-left mb-8">
            <h3 className="font-heading font-medium text-charcoal text-sm mb-3">Your Profile Snapshot</h3>
            {summaryItems.map((item) => (
              <ProfileSummaryItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-heading font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Explore Career Paths
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-xs text-slate font-body mt-2">Coming soon</p>
      </div>
    </div>
  );
}
