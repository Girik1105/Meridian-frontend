"use client";

import { useTypingEffect } from "@/hooks";
import { ArrowRight, Sparkles, Compass } from "lucide-react";

const phrases = ["mentor", "guide", "compass", "champion"];

export function Hero() {
  const { displayText, isTyping } = useTypingEffect({
    phrases,
    typingSpeed: 90,
    deletingSpeed: 50,
    pauseDuration: 2200,
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#0c1425_0%,#1E2A5E_50%,#172048_100%)]" />

      {/* Geometric accent rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-secondary/[0.06]" />
        <div className="absolute top-[45%] left-[58%] -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-secondary/[0.04]" />
        <div className="absolute top-[55%] left-[65%] -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-accent/[0.05]" />
        {/* Horizontal meridian line */}
        <div className="absolute top-[55%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        {/* Vertical meridian line */}
        <div className="absolute top-0 bottom-0 left-[62%] w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent hidden lg:block" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-28 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span className="font-heading text-xs font-medium tracking-wider text-white/60 uppercase">
                AI-Powered Career Guidance
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Everyone deserves
              <br />
              a career{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#2BBCB3,#4dd9d0)]">
                  {displayText}
                </span>
                <span
                  className={`inline-block w-[3px] h-[0.8em] bg-secondary ml-0.5 align-middle rounded-full ${
                    isTyping ? "" : "animate-blink-cursor"
                  }`}
                />
                <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-secondary/30 rounded-full" />
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 mt-6 max-w-xl text-base leading-relaxed text-white/50 font-body sm:text-lg md:mt-8">
              Meridian uses AI to provide the personalized career mentorship that
              was once reserved for the privileged few. No gatekeepers. No
              guesswork. Just honest guidance.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center lg:items-start gap-4 sm:flex-row md:mt-10">
              <a
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-4 font-heading text-base font-semibold text-white shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:bg-[#26a89f] transition-all min-h-[44px]"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#problem"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-8 py-4 font-heading text-base font-medium text-white/70 hover:bg-white/5 hover:text-white/90 transition-all min-h-[44px]"
              >
                Learn More
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-white/30 text-xs font-heading tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-secondary/60" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-secondary/60" />
                5-minute setup
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-secondary/60" />
                Built at HackASU 2026
              </span>
            </div>
          </div>

          {/* Right: Journey path visualization */}
          <div className="hidden lg:block">
            <div className="relative">
              <Compass
                className="absolute -top-6 -right-6 w-28 h-28 text-white/[0.03]"
                strokeWidth={0.5}
              />

              {/* Step 1 — active */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full border border-secondary/30 bg-secondary/10 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full bg-secondary/15 animate-pulse-glow" />
                  <span className="font-mono text-xs font-bold text-secondary relative z-10">
                    01
                  </span>
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-white/90">
                    Build Your Profile
                  </p>
                  <p className="font-body text-xs text-white/30 mt-0.5">
                    5-min AI conversation
                  </p>
                </div>
              </div>

              <div className="ml-6 w-px h-10 border-l border-dashed border-white/10" />

              {/* Step 2 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center shrink-0">
                  <span className="font-mono text-xs font-bold text-white/30">
                    02
                  </span>
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-white/40">
                    Discover Paths
                  </p>
                  <p className="font-body text-xs text-white/20 mt-0.5">
                    AI-generated career matches
                  </p>
                </div>
              </div>

              <div className="ml-6 w-px h-10 border-l border-dashed border-white/10" />

              {/* Step 3 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center shrink-0">
                  <span className="font-mono text-xs font-bold text-white/30">
                    03
                  </span>
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-white/40">
                    Try Skill Tasters
                  </p>
                  <p className="font-body text-xs text-white/20 mt-0.5">
                    30-min hands-on preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-snow via-snow/30 to-transparent" />
    </section>
  );
}
