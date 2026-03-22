"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { generateCareerPaths, getCareerPaths, selectCareerPath } from "@/lib/api";
import type { CareerPath } from "@/types/career";
import GeneratingPaths from "./GeneratingPaths";
import SortBar from "./SortBar";
import CareerPathCard from "./CareerPathCard";
import SelectConfirmation from "./SelectConfirmation";
import { RefreshCw, LayoutList, LayoutGrid } from "lucide-react";

type Phase = "generating" | "browsing" | "confirming";

export default function CareerPathsView() {
  const router = useRouter();
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [phase, setPhase] = useState<Phase>("generating");
  const [sortBy, setSortBy] = useState("best_match");
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<"list" | "grid">("list");

  useEffect(() => {
    let cancelled = false;
    async function loadOrGenerate() {
      try {
        // Try fetching existing paths first
        const result = await getCareerPaths();
        if (cancelled) return;
        const existing = result.paths || [];
        if (existing.length > 0) {
          setPaths(existing);
          setPhase("browsing");
          return;
        }
        // No existing paths — generate new ones
        const data = await generateCareerPaths();
        if (cancelled) return;
        setPaths(Array.isArray(data) ? data : (data.paths || []));
        setPhase("browsing");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }
    loadOrGenerate();
    return () => { cancelled = true; };
  }, []);

  const topPickId = useMemo(() => {
    if (paths.length === 0) return null;
    return paths.reduce((best, p) =>
      p.relevance_score > best.relevance_score ? p : best
    ).id;
  }, [paths]);

  const sortedPaths = useMemo(() => {
    const sorted = [...paths];
    switch (sortBy) {
      case "best_match":
        sorted.sort((a, b) => b.relevance_score - a.relevance_score);
        break;
      case "highest_roi":
        sorted.sort((a, b) => b.roi_data.roi_score - a.roi_data.roi_score);
        break;
      case "fastest":
        sorted.sort((a, b) => a.estimated_timeline_months - b.estimated_timeline_months);
        break;
      case "lowest_cost":
        sorted.sort((a, b) => a.roi_data.estimated_cost - b.roi_data.estimated_cost);
        break;
    }
    return sorted;
  }, [paths, sortBy]);

  async function handleConfirmSelection() {
    if (!selectedPath) return;
    await selectCareerPath(selectedPath.id);
    router.push("/tasters");
  }

  // --- Phase: generating ---
  if (phase === "generating") {
    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center animate-fade-in-up">
          <div className="text-center max-w-sm">
            <p className="font-body text-sm text-charcoal mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setPhase("generating");
                generateCareerPaths()
                  .then((data) => {
                    setPaths(data);
                    setPhase("browsing");
                  })
                  .catch((err) =>
                    setError(err instanceof Error ? err.message : "Something went wrong")
                  );
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-heading font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      );
    }
    return <GeneratingPaths />;
  }

  // --- Phase: confirming ---
  if (phase === "confirming" && selectedPath) {
    return (
      <SelectConfirmation
        path={selectedPath}
        onConfirm={handleConfirmSelection}
        onBack={() => {
          setPhase("browsing");
          setSelectedPath(null);
        }}
      />
    );
  }

  // --- Phase: browsing ---
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-ink mb-1">
            Your Career Paths
          </h1>
          <p className="font-body text-sm text-slate">
            Based on your profile, here are personalized career paths to explore.
            You can change your selection anytime &mdash; just come back here and pick a different path.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <SortBar activeSort={sortBy} onSort={setSortBy} />
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setLayout("list")}
              className={`p-2 rounded-lg transition-colors ${
                layout === "list" ? "bg-primary text-white" : "text-slate hover:bg-cloud"
              }`}
              title="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-lg transition-colors ${
                layout === "grid" ? "bg-primary text-white" : "text-slate hover:bg-cloud"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className={layout === "grid" ? "grid gap-4 md:grid-cols-2 pb-8" : "space-y-4 pb-8"}>
          {sortedPaths.map((path, i) => (
            <div
              key={path.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <CareerPathCard
                path={path}
                isExpanded={expandedId === path.id}
                isTopPick={path.id === topPickId}
                isSelected={path.is_selected}
                compact={layout === "grid"}
                onToggle={() =>
                  setExpandedId((prev) => (prev === path.id ? null : path.id))
                }
                onSelect={() => {
                  setSelectedPath(path);
                  setPhase("confirming");
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
