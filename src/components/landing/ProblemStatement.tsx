"use client";

import { useScrollAnimation, useCountUp } from "@/hooks";
import { TrendingDown, DollarSign, Users, AlertTriangle } from "lucide-react";

const stats = [
  { end: 70, suffix: "%", label: "of workers feel stuck in their career", icon: TrendingDown },
  { end: 300, suffix: "+", label: "average cost per hour of career coaching", icon: DollarSign },
  { end: 44, suffix: "M", label: "Americans lack access to career guidance", icon: Users },
];

function StatCard({
  end,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  end: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: string;
}) {
  const { ref, count } = useCountUp({ end, suffix });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center rounded-xl bg-white p-6 shadow-sm border border-silver/50 md:p-8"
      style={{ transitionDelay: delay }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light">
        <Icon className="h-6 w-6 text-secondary" />
      </div>
      <span className="font-heading text-3xl font-bold text-primary md:text-4xl">
        {count}
      </span>
      <span className="mt-2 text-sm text-slate leading-relaxed md:text-base">
        {label}
      </span>
    </div>
  );
}

export function ProblemStatement() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({});
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollAnimation({});

  return (
    <section id="problem" className="bg-snow py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div
            ref={headingRef}
            className={`transition-all duration-700 ${
              headingVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-light px-4 py-1.5 font-heading text-xs font-medium text-accent">
              <AlertTriangle className="h-3.5 w-3.5" />
              The Problem
            </div>
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
              Career guidance shouldn&apos;t be a luxury
            </h2>
          </div>

          <p
            ref={bodyRef}
            className={`mx-auto mt-4 max-w-2xl text-base text-charcoal leading-relaxed transition-all duration-700 delay-200 md:text-lg ${
              bodyVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Millions of people navigate their careers alone — without mentors,
            without connections, without anyone to help them see what&apos;s
            possible. The advice gap is real, and it&apos;s holding people back.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={`${i * 150}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
