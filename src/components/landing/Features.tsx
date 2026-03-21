"use client";

import { useRef, useCallback } from "react";
import { useScrollAnimation } from "@/hooks";
import {
  Brain,
  Sparkles,
  Shield,
  BarChart3,
  Globe,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Context-Aware Mentoring",
    summary: "Your AI mentor remembers your story across every interaction.",
    detail: "Conversations build on each other — no repeating yourself.",
  },
  {
    icon: Sparkles,
    title: "Personalized Paths",
    summary: "Career suggestions grounded in your unique skills and situation.",
    detail: "Real labor market data, not generic advice.",
  },
  {
    icon: Shield,
    title: "Honest Assessment",
    summary: "Candid feedback framed as observations, not judgments.",
    detail: "We tell you what you need to hear, not what you want to hear.",
  },
  {
    icon: BarChart3,
    title: "ROI Transparency",
    summary: "See the investment and return before you commit to a skill.",
    detail: "Time, cost, demand, and salary uplift — all visible.",
  },
  {
    icon: Globe,
    title: "Accessible to All",
    summary: "Free, browser-based, and designed for first-generation professionals.",
    detail: "No expensive subscriptions or hidden paywalls.",
  },
  {
    icon: Heart,
    title: "Empowerment First",
    summary: "We help you decide — we never decide for you.",
    detail: "Your career, your choices, your path.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  summary,
  detail,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  summary: string;
  detail: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: scrollRef, isVisible } = useScrollAnimation({});

  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      scrollRef(node);
    },
    [scrollRef]
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    el.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div
      ref={combinedRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      className={`group relative rounded-xl bg-white p-6 shadow-sm border border-silver/50 transition-all duration-500 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 md:p-8 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-heading text-lg font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-charcoal leading-relaxed">{summary}</p>
      <p className="mt-2 text-sm text-slate opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {detail}
      </p>
    </div>
  );
}

export function Features() {
  const { ref, isVisible } = useScrollAnimation({});

  return (
    <section id="features" className="bg-snow py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div
          ref={ref}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="mb-3 font-heading text-sm font-medium uppercase tracking-widest text-secondary">
            Features
          </p>
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            Built for people, not profiles
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal leading-relaxed md:text-lg">
            Every feature is designed with empowerment and transparency at its core.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
