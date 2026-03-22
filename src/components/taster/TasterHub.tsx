"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  Compass,
  ArrowRight,
  ChevronRight,
  Clock,
  Check,
  Play,
  Sparkles,
  Map,
  Loader2,
} from "lucide-react";
import type { CareerPath } from "@/types/career";
import type { SkillTaster } from "@/types/taster";
import { getCareerPaths, getTasters, generateTaster } from "@/lib/api";

export default function TasterHub() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [tasters, setTasters] = useState<SkillTaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSkill, setGeneratingSkill] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const paths: CareerPath[] = await getCareerPaths();
        const selected = paths.find((p) => p.is_selected) ?? null;
        if (cancelled) return;
        setSelectedPath(selected);

        if (selected) {
          const existing = await getTasters(selected.id);
          if (!cancelled) setTasters(existing);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGenerate(skillName: string) {
    if (!selectedPath) return;
    setGeneratingSkill(skillName);
    setError(null);
    try {
      const newTaster = await generateTaster(selectedPath.id, skillName);
      router.push(`/tasters/${newTaster.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setGeneratingSkill(null);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-8 w-8 text-secondary animate-spin" />
          <span className="text-slate font-body text-sm">
            Loading your skills...
          </span>
        </div>
      </div>
    );
  }

  if (!selectedPath) {
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in-up">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-light mb-4">
            <Map className="h-7 w-7 text-accent" />
          </div>
          <h2 className="font-heading text-xl font-bold text-ink mb-2">
            Select a Career Path First
          </h2>
          <p className="font-body text-sm text-charcoal mb-6">
            You need to select a career path before exploring skill tasters.
          </p>
          <button
            onClick={() => router.push("/career-paths")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-heading font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Explore Career Paths
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const skills = selectedPath.required_skills;
  const tastersBySkill: Record<string, SkillTaster> = {};
  tasters.forEach((t) => { tastersBySkill[t.skill_name] = t; });

  const STATUS_CONFIG = {
    not_started: { label: "Not Started", color: "text-slate", bg: "bg-cloud" },
    in_progress: {
      label: "In Progress",
      color: "text-secondary",
      bg: "bg-secondary-light",
    },
    completed: {
      label: "Completed",
      color: "text-success",
      bg: "bg-success-light",
    },
  };

  // Full-screen generating overlay
  if (generatingSkill) {
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in-up">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-light mb-5">
            <Loader2 className="h-8 w-8 text-secondary animate-spin" />
          </div>
          <h2 className="font-heading text-xl font-bold text-ink mb-2">
            Generating Your Taster
          </h2>
          <p className="font-body text-sm text-charcoal mb-4">
            Our AI mentor is crafting a personalized 30-minute experience for{" "}
            <strong className="font-heading font-semibold">{generatingSkill}</strong>.
          </p>
          {/* Animated progress bar */}
          <div className="w-full h-2 bg-cloud rounded-full overflow-hidden mb-3">
            <div className="h-full bg-secondary rounded-full animate-pulse-glow" style={{ width: "80%", transition: "width 10s ease-out" }} />
          </div>
          <p className="font-body text-xs text-slate">
            This usually takes 15&ndash;30 seconds...
          </p>
          {error && (
            <div className="mt-4 bg-accent-light rounded-xl p-3 text-sm font-body text-accent">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="font-heading text-2xl font-bold text-ink mb-1">
            Skill Tasters
          </h1>
          <p className="font-body text-sm text-slate">
            Try 30-minute hands-on experiences for skills in your selected path.
          </p>
        </div>

        {/* Selected path card */}
        <div
          className="bg-white rounded-2xl border border-secondary/30 p-4 mb-6 flex items-center justify-between animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <div>
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate">
              Selected Path
            </span>
            <h2 className="font-heading text-lg font-bold text-ink">
              {selectedPath.title}
            </h2>
          </div>
          <button
            onClick={() => router.push("/career-paths")}
            className="text-xs font-heading font-medium text-secondary hover:text-secondary/80 transition-colors"
          >
            Change path
          </button>
        </div>

        {error && (
          <div className="bg-accent-light rounded-xl p-3 mb-4 text-sm font-body text-accent">
            {error}
          </div>
        )}

        {/* Skills roadmap */}
        <div className="flex flex-col">
          {skills.map((skill, i) => {
            const taster = tastersBySkill[skill];
            const isGenerating = generatingSkill === skill;
            const isLast = i === skills.length - 1;

            const isCompleted = taster?.status === "completed";
            const isInProgress = taster?.status === "in_progress";

            // Step circle style
            const circleClass = isCompleted
              ? "bg-success text-white"
              : isInProgress
                ? "bg-secondary text-white"
                : "bg-cloud text-slate";

            // Connector line style
            const connectorClass = isCompleted
              ? "bg-success"
              : "border-l-2 border-dashed border-silver bg-transparent";

            // Action text & icon
            let actionText = "Generate Taster";
            let ActionIcon = Sparkles;
            if (taster) {
              if (isCompleted) {
                actionText = "View Assessment";
                ActionIcon = ArrowRight;
              } else if (isInProgress) {
                actionText = "Continue";
                ActionIcon = ArrowRight;
              } else {
                actionText = "Start Taster";
                ActionIcon = ArrowRight;
              }
            }

            const handleClick = () => {
              if (taster) {
                router.push(`/tasters/${taster.id}`);
              } else {
                handleGenerate(skill);
              }
            };

            const config = taster ? STATUS_CONFIG[taster.status] : null;

            return (
              <div
                key={skill}
                className="flex animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 150}ms` }}
              >
                {/* Left: step circle + connector */}
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm ${circleClass}`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : isInProgress ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 min-h-[24px] ${isCompleted ? "bg-success" : ""}`}
                      style={
                        !isCompleted
                          ? {
                              backgroundImage:
                                "linear-gradient(to bottom, #D1D5DB 50%, transparent 50%)",
                              backgroundSize: "2px 8px",
                              backgroundRepeat: "repeat-y",
                              width: "2px",
                            }
                          : undefined
                      }
                    />
                  )}
                </div>

                {/* Right: skill card */}
                <button
                  onClick={handleClick}
                  disabled={!taster && (isGenerating || !!generatingSkill)}
                  className={`flex-1 mb-3 bg-white rounded-2xl border p-4 text-left flex items-center gap-4 transition-all group ${
                    taster
                      ? "border-silver/50 shadow-sm hover:shadow-md hover:border-secondary/40"
                      : "border-dashed border-silver hover:border-secondary/40 hover:shadow-sm"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      taster ? "bg-secondary-light" : "bg-cloud"
                    }`}
                  >
                    {taster ? (
                      <FlaskConical className="h-5 w-5 text-secondary" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-slate" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base font-semibold text-ink truncate">
                      {skill}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      {config && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-heading font-medium ${config.color} ${config.bg}`}
                        >
                          {isCompleted && <Check className="h-3 w-3" />}
                          {isInProgress && <Play className="h-3 w-3" />}
                          {config.label}
                        </span>
                      )}
                      {taster && (
                        <span className="flex items-center gap-1 text-xs font-heading text-slate">
                          <Clock className="h-3.5 w-3.5" />~
                          {taster.taster_content.estimated_minutes} min
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isGenerating ? (
                      <div className="flex items-center gap-2 text-xs font-heading text-secondary">
                        <div className="h-3.5 w-3.5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-heading font-medium text-secondary group-hover:text-secondary/80 transition-colors">
                        {actionText}
                        <ActionIcon className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-silver group-hover:text-secondary/60 transition-colors ml-1" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
