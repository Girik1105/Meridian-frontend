"use client";

import { useState, useCallback } from "react";
import { useScrollAnimation } from "@/hooks";
import { MessageCircle, Map, BookOpen } from "lucide-react";

const steps = [
  {
    id: "know-me",
    number: "01",
    title: "Know Me",
    subtitle: "Conversational Onboarding",
    icon: MessageCircle,
    description:
      "Have a real conversation with your AI mentor. In 5–8 exchanges, Meridian maps your skills, interests, constraints, and goals — no forms, no quizzes, just an honest dialogue.",
    detail: "Produces a structured profile that evolves as you do.",
  },
  {
    id: "show-me",
    number: "02",
    title: "Show Me the Way",
    subtitle: "Career Path Discovery",
    icon: Map,
    description:
      "Based on your profile, Meridian generates 2–3 realistic career paths. Each one includes role titles, required skills, timelines, and salary context — grounded in real labor data.",
    detail: "Every suggestion comes with a confidence disclaimer.",
  },
  {
    id: "try-it",
    number: "03",
    title: "Try Before You Commit",
    subtitle: "Skill Tasters",
    icon: BookOpen,
    description:
      "Curious about a skill? Take a focused 30-minute crash course with micro-modules: read, watch, and try. End with a reflection prompt so you know if it clicks.",
    detail: "Honest feedback — not flattery — helps you decide what's worth pursuing.",
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, isVisible } = useScrollAnimation({});

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveTab((prev) => (prev + 1) % steps.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveTab((prev) => (prev - 1 + steps.length) % steps.length);
      }
    },
    []
  );

  const active = steps[activeTab];

  return (
    <section id="how-it-works" className="bg-cloud py-16 md:py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 md:px-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-heading text-sm font-medium uppercase tracking-widest text-secondary">
            How It Works
          </p>
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            Three steps to career clarity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal leading-relaxed md:text-lg">
            Meridian meets you where you are and helps you see where you could go.
          </p>
        </div>

        {/* Tab buttons */}
        <div
          role="tablist"
          aria-label="How it works steps"
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-2 md:mt-14"
          onKeyDown={handleKeyDown}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeTab;
            return (
              <button
                key={step.id}
                role="tab"
                id={`tab-${step.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${step.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-3 rounded-xl px-5 py-4 font-heading text-sm font-medium transition-all min-h-[44px] sm:flex-col sm:gap-2 sm:px-6 sm:py-5 sm:text-center ${
                  isActive
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-charcoal hover:bg-white/80 shadow-sm"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-secondary" : "text-slate"}`} />
                <span>
                  <span className="text-xs opacity-60">{step.number}</span>{" "}
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab panel */}
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="mt-8 mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-silver/50 md:p-10"
        >
          <p className="mb-2 font-heading text-xs font-medium uppercase tracking-wider text-secondary">
            {active.subtitle}
          </p>
          <h3 className="font-heading text-xl font-bold text-primary md:text-2xl">
            {active.title}
          </h3>
          <p className="mt-4 text-base text-charcoal leading-relaxed md:text-lg">
            {active.description}
          </p>
          <p className="mt-4 text-sm text-slate italic">{active.detail}</p>
        </div>
      </div>
    </section>
  );
}
