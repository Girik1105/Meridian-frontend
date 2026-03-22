"use client";

import { Clock, DollarSign, TrendingUp, Star, ChevronDown, ChevronUp, Check } from "lucide-react";
import type { CareerPath } from "@/types/career";
import ROIBreakdown from "./ROIBreakdown";

interface CareerPathCardProps {
  path: CareerPath;
  isExpanded: boolean;
  isTopPick: boolean;
  isSelected?: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

export default function CareerPathCard({
  path,
  isExpanded,
  isTopPick,
  isSelected,
  onToggle,
  onSelect,
}: CareerPathCardProps) {
  const matchPercent = Math.round(path.relevance_score * 100);
  const salaryMin = Math.round(path.salary_range.min / 1000);
  const salaryMax = Math.round(path.salary_range.max / 1000);
  const visibleSkills = isExpanded ? path.required_skills : path.required_skills.slice(0, 4);
  const hiddenCount = path.required_skills.length - 4;

  return (
    <div
      className={`relative rounded-2xl border p-5 shadow-sm transition-all duration-300 cursor-pointer ${
        isTopPick
          ? "bg-white border-accent/40 ring-1 ring-accent/10"
          : "bg-white border-silver/50 hover:border-secondary/40 hover:shadow-md"
      }`}
      onClick={onToggle}
    >
      {/* Top pick / selected badges */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isSelected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-light px-2.5 py-0.5 text-xs font-heading font-medium text-secondary">
            <Check className="h-3 w-3" />
            Currently Selected
          </span>
        )}
        {isTopPick && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-heading font-medium text-accent">
            <Star className="h-3 w-3" />
            Meridian&apos;s pick
          </span>
        )}
      </div>

      {/* Row 1: Title + match badge */}
      <div className="flex items-start gap-3 mb-2">
        <h3 className="font-heading text-lg font-bold text-ink flex-1 pr-2">
          {path.title}
        </h3>
        <span className="shrink-0 inline-flex items-center rounded-full bg-secondary-light px-2.5 py-0.5 text-xs font-heading font-semibold text-secondary">
          {matchPercent}% match
        </span>
      </div>

      {/* Row 2: Description */}
      <p className={`font-body text-sm text-charcoal leading-relaxed mb-3 ${
        isExpanded ? "" : "line-clamp-2"
      }`}>
        {path.description}
      </p>

      {/* Row 3: Metric pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-light text-primary text-xs font-heading font-medium">
          <Clock className="h-3 w-3" />
          {path.estimated_timeline_months} months
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-success-light text-success text-xs font-heading font-medium">
          <DollarSign className="h-3 w-3" />
          ${salaryMin}K–${salaryMax}K
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-light text-accent text-xs font-heading font-medium">
          <TrendingUp className="h-3 w-3" />
          {path.roi_data.roi_score}/10 ROI
        </span>
      </div>

      {/* Row 4: Skills */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {visibleSkills.map((skill) => (
          <span
            key={skill}
            className="bg-cloud text-charcoal rounded-full px-2.5 py-0.5 text-xs font-heading"
          >
            {skill}
          </span>
        ))}
        {!isExpanded && hiddenCount > 0 && (
          <span className="text-xs text-slate font-heading py-0.5">
            +{hiddenCount} more
          </span>
        )}
      </div>

      {/* Expand/collapse indicator */}
      <div className="flex justify-center pt-1">
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate" />
        )}
      </div>

      {/* Expanded content */}
      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            {/* Match reasoning */}
            <div className="mb-4">
              <h4 className="font-heading text-xs text-slate uppercase tracking-wider font-semibold mb-2">
                Why this path?
              </h4>
              <p className="font-body text-sm text-charcoal leading-relaxed">
                {path.match_reasoning}
              </p>
            </div>

            {/* ROI Breakdown */}
            <ROIBreakdown roi={path.roi_data} timelineMonths={path.estimated_timeline_months} />

            {/* Confidence disclaimer */}
            <div className="mt-4 bg-cloud rounded-lg p-3 text-xs text-slate font-body leading-relaxed">
              These are AI-generated suggestions based on general labor market knowledge.
              Cross-reference with local career centers, job postings, and professionals in the field.
            </div>

            {/* Select button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isSelected) onSelect();
              }}
              disabled={isSelected}
              className={`mt-4 w-full py-3 rounded-xl font-heading font-semibold transition-colors ${
                isSelected
                  ? "bg-secondary-light text-secondary cursor-default"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isSelected ? "Selected" : "Select This Path"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
