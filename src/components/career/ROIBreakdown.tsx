"use client";

import { useState } from "react";
import { Clock, DollarSign, TrendingUp, BarChart3, Info } from "lucide-react";
import type { ROIData } from "@/types/career";

interface ROIBreakdownProps {
  roi: ROIData;
  timelineMonths: number;
}

export default function ROIBreakdown({ roi, timelineMonths }: ROIBreakdownProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  const hoursPerWeek = timelineMonths > 0
    ? Math.round(roi.learning_time_hours / (timelineMonths * 4))
    : roi.learning_time_hours;

  const difficultyColor = {
    low: "bg-success-light text-success",
    moderate: "bg-accent-light text-accent",
    high: "bg-primary-light text-primary",
  }[roi.difficulty];

  const roiScoreColor =
    roi.roi_score >= 8
      ? "bg-success-light text-success"
      : roi.roi_score >= 5
        ? "bg-accent-light text-accent"
        : "bg-cloud text-slate";

  const demandSegments = Math.round(roi.job_demand_score * 5);

  return (
    <div className="mt-4 rounded-xl bg-cloud/50 p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Investment column */}
        <div>
          <h4 className="font-heading text-xs text-slate uppercase tracking-wider font-semibold mb-3">
            Your Investment
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-slate mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-heading font-medium text-charcoal">
                  ~{hoursPerWeek} hrs/week for {timelineMonths} months
                </p>
                <p className="text-xs text-slate font-body">
                  {roi.learning_time_hours} hours total
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-slate mt-0.5 shrink-0" />
              <p className="text-sm font-heading font-medium text-charcoal">
                {roi.estimated_cost === 0
                  ? "$0 (free resources)"
                  : `$${roi.estimated_cost.toLocaleString()}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-heading font-medium ${difficultyColor}`}>
                {roi.difficulty.charAt(0).toUpperCase() + roi.difficulty.slice(1)} difficulty
              </span>
            </div>
          </div>
        </div>

        {/* Return column */}
        <div>
          <h4 className="font-heading text-xs text-slate uppercase tracking-wider font-semibold mb-3">
            Potential Return
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <p className="text-sm font-heading font-medium text-success">
                +${roi.salary_uplift.toLocaleString()}/year
              </p>
            </div>

            <div className="flex items-start gap-2">
              <BarChart3 className="h-4 w-4 text-slate mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate font-body mb-1">Job demand</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-5 rounded-sm ${
                        i < demandSegments ? "bg-secondary" : "bg-silver/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-lg font-mono font-bold ${roiScoreColor}`}>
                {roi.roi_score}
              </span>
              <span className="text-xs text-slate font-body">/10 ROI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology toggle */}
      <div className="mt-4 pt-3 border-t border-silver/30">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="flex items-center gap-1 text-xs text-slate hover:text-charcoal font-heading font-medium transition-colors"
        >
          <Info className="h-3 w-3" />
          How is this calculated?
        </button>
        {showMethodology && (
          <p className="mt-2 text-xs text-slate font-body leading-relaxed">
            {roi.methodology}
          </p>
        )}
      </div>

      {/* Data source badge */}
      {roi.data_source === "training_data" && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate font-body">
          <Info className="h-3 w-3 shrink-0" />
          Estimates based on AI knowledge, not live market data.
        </div>
      )}
    </div>
  );
}
