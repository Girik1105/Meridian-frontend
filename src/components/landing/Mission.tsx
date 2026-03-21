"use client";

import { useScrollAnimation } from "@/hooks";

const principles = [
  "Empowerment over dependency",
  "Transparency always",
  "No cultural assumptions",
  "Honest about limitations",
  "Accessible to all",
];

export function Mission() {
  const { ref, isVisible } = useScrollAnimation({});

  return (
    <section id="mission" className="bg-primary py-16 md:py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-4 text-center md:px-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="mb-3 font-heading text-sm font-medium uppercase tracking-widest text-secondary">
          Our Mission
        </p>

        <blockquote className="mx-auto max-w-3xl">
          <p className="font-heading text-xl font-bold leading-relaxed text-white sm:text-2xl md:text-3xl">
            &ldquo;Everyone deserves access to the kind of career advice that
            changes lives — not just those who already have connections.&rdquo;
          </p>
        </blockquote>

        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 leading-relaxed md:text-lg">
          Meridian is an AI mentor, not a licensed career counselor. We encourage
          you to cross-reference all suggestions with human advisors and your own
          research. Our goal is to open doors, not replace the people behind them.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {principles.map((p) => (
            <span
              key={p}
              className="rounded-full border border-white/20 px-4 py-2 font-heading text-xs font-medium text-white/80 md:text-sm"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
