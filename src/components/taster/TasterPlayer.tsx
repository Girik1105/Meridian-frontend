"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Code,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Clock,
  Menu,
  X,
} from "lucide-react";
import type { SkillTasterDetail, TasterResponse } from "@/types/taster";
import { startTaster, respondToModule, completeTaster } from "@/lib/api";
import ModuleContent from "./ModuleContent";

interface TasterPlayerProps {
  taster: SkillTasterDetail;
  onComplete: (updated: SkillTasterDetail) => void;
}

const TYPE_ICONS = {
  read: BookOpen,
  exercise: Code,
  reflect: MessageSquare,
};

export default function TasterPlayer({ taster, onComplete }: TasterPlayerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, TasterResponse>>(
    () => {
      const map = new Map<string, TasterResponse>();
      taster.responses.forEach((r) => map.set(r.module_id, r));
      return map;
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const moduleStartRef = useRef(Date.now());

  const modules = taster.taster_content.modules;
  const activeModule = modules[activeIndex];
  const completedCount = responses.size;
  const allCompleted = completedCount === modules.length;

  // Auto-start taster
  useEffect(() => {
    if (taster.status === "not_started") {
      startTaster(taster.id).catch(() => {});
    }
  }, [taster.id, taster.status]);

  // Reset timer on module change
  useEffect(() => {
    moduleStartRef.current = Date.now();
  }, [activeIndex]);

  const handleSubmitResponse = useCallback(
    async (userResponse: string) => {
      setSubmitting(true);
      try {
        const timeSpent = Math.round(
          (Date.now() - moduleStartRef.current) / 1000
        );
        const result = await respondToModule(
          taster.id,
          activeModule.id,
          userResponse,
          timeSpent
        );
        setResponses((prev) => {
          const next = new Map(prev);
          next.set(activeModule.id, result);
          return next;
        });
      } finally {
        setSubmitting(false);
      }
    },
    [taster.id, activeModule.id]
  );

  async function handleComplete() {
    setCompleting(true);
    try {
      const result = await completeTaster(taster.id);
      onComplete(result);
    } catch {
      setCompleting(false);
    }
  }

  // Find first incomplete module
  function goToNextIncomplete() {
    for (let i = 0; i < modules.length; i++) {
      if (!responses.has(modules[i].id)) {
        setActiveIndex(i);
        return;
      }
    }
  }

  const progressPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="h-screen bg-snow flex flex-col overflow-hidden">
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-silver/50 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/tasters")}
          className="text-slate hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-cloud rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs font-heading text-slate text-center mt-1">
            {completedCount}/{modules.length} modules
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate hover:text-ink transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-silver/50 flex-shrink-0">
          <div className="p-5 border-b border-silver/50">
            <button
              onClick={() => router.push("/tasters")}
              className="flex items-center gap-1.5 text-xs font-heading font-medium text-slate hover:text-ink transition-colors mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Skills
            </button>
            <h2 className="font-heading text-base font-bold text-ink">
              {taster.taster_content.skill_name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-heading text-slate">
              <Clock className="h-3.5 w-3.5" />
              ~{taster.taster_content.estimated_minutes} min total
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-cloud rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs font-heading text-slate mt-1">
              {completedCount}/{modules.length} complete
            </p>
          </div>

          {/* Module nav */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {modules.map((mod, i) => {
              const Icon = TYPE_ICONS[mod.type];
              const isActive = i === activeIndex;
              const isDone = responses.has(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isActive
                      ? "bg-secondary-light"
                      : "hover:bg-cloud"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isDone
                        ? "bg-success-light"
                        : isActive
                          ? "bg-secondary/20"
                          : "bg-cloud"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Icon
                        className={`h-3.5 w-3.5 ${
                          isActive ? "text-secondary" : "text-slate"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-sm font-heading truncate ${
                      isActive
                        ? "font-semibold text-ink"
                        : isDone
                          ? "text-charcoal"
                          : "text-slate"
                    }`}
                  >
                    {mod.title}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Complete button */}
          <div className="p-4 border-t border-silver/50">
            {allCompleted ? (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {completing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Assessment...
                  </>
                ) : (
                  "Complete Taster"
                )}
              </button>
            ) : (
              <button
                onClick={goToNextIncomplete}
                className="w-full py-3 rounded-xl bg-cloud text-charcoal font-heading font-medium hover:bg-silver/30 transition-colors text-sm"
              >
                Go to next module
              </button>
            )}
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-ink/30"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg flex flex-col animate-fade-in-up">
              <div className="p-4 border-b border-silver/50 flex items-center justify-between">
                <h2 className="font-heading text-base font-bold text-ink">
                  {taster.taster_content.skill_name}
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {modules.map((mod, i) => {
                  const Icon = TYPE_ICONS[mod.type];
                  const isActive = i === activeIndex;
                  const isDone = responses.has(mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveIndex(i);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        isActive ? "bg-secondary-light" : "hover:bg-cloud"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isDone
                            ? "bg-success-light"
                            : isActive
                              ? "bg-secondary/20"
                              : "bg-cloud"
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Icon
                            className={`h-3.5 w-3.5 ${
                              isActive ? "text-secondary" : "text-slate"
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm font-heading truncate ${
                          isActive
                            ? "font-semibold text-ink"
                            : isDone
                              ? "text-charcoal"
                              : "text-slate"
                        }`}
                      >
                        {mod.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-silver/50">
                {allCompleted ? (
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      handleComplete();
                    }}
                    disabled={completing}
                    className="w-full py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Complete Taster
                  </button>
                ) : (
                  <p className="text-xs font-heading text-slate text-center">
                    {completedCount}/{modules.length} modules complete
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
            <ModuleContent
              key={activeModule.id}
              module={activeModule}
              response={responses.get(activeModule.id)}
              onSubmit={handleSubmitResponse}
              submitting={submitting}
            />

            {/* Prev/Next navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                disabled={activeIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-heading font-medium text-slate hover:text-ink hover:bg-cloud transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              {activeIndex < modules.length - 1 ? (
                <button
                  onClick={() =>
                    setActiveIndex((i) => Math.min(modules.length - 1, i + 1))
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-heading font-medium text-secondary hover:bg-secondary-light transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : allCompleted ? (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-heading font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {completing ? "Generating..." : "Complete Taster"}
                </button>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
