"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  Compass,
  ArrowRight,
  Clock,
  Check,
  Play,
  Sparkles,
  Map,
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

        {/* Skills grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill, i) => {
            const taster = tastersBySkill[skill];
            const isGenerating = generatingSkill === skill;

            if (taster) {
              const config = STATUS_CONFIG[taster.status];
              return (
                <button
                  key={skill}
                  onClick={() => router.push(`/tasters/${taster.id}`)}
                  className="bg-white rounded-2xl border border-silver/50 p-5 shadow-sm text-left hover:shadow-md hover:border-secondary/40 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${(i + 2) * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-secondary" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-heading font-medium ${config.color} ${config.bg}`}
                    >
                      {taster.status === "completed" && (
                        <Check className="h-3 w-3" />
                      )}
                      {taster.status === "in_progress" && (
                        <Play className="h-3 w-3" />
                      )}
                      {config.label}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-ink mb-1">
                    {skill}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-heading text-slate">
                    <Clock className="h-3.5 w-3.5" />
                    ~{taster.taster_content.estimated_minutes} min
                  </div>
                </button>
              );
            }

            return (
              <button
                key={skill}
                onClick={() => handleGenerate(skill)}
                disabled={isGenerating || !!generatingSkill}
                className="bg-white rounded-2xl border border-dashed border-silver p-5 text-left hover:border-secondary/40 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 150}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cloud flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-slate" />
                  </div>
                </div>
                <h3 className="font-heading text-base font-semibold text-ink mb-1">
                  {skill}
                </h3>
                {isGenerating ? (
                  <div className="flex items-center gap-2 text-xs font-heading text-secondary">
                    <div className="h-3.5 w-3.5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                    Generating taster...
                  </div>
                ) : (
                  <span className="text-xs font-heading font-medium text-secondary">
                    Generate Taster
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
