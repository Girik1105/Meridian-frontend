"use client";

import { useTypingEffect } from "@/hooks";
import { ArrowRight, Sparkles } from "lucide-react";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f1a3e_0%,#1E2A5E_40%,#1a2f6e_60%,#162350_100%)]" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] animate-grid-drift"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large teal orb — top right */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[100px] animate-float" />
        {/* Amber orb — bottom left */}
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-accent/12 blur-[80px] animate-float-delayed" />
        {/* Small teal orb — center left */}
        <div className="absolute top-1/3 left-[10%] w-[250px] h-[250px] rounded-full bg-secondary/10 blur-[60px] animate-pulse-glow" />
        {/* Accent glow — center right */}
        <div className="absolute top-1/2 right-[15%] w-[200px] h-[200px] rounded-full bg-accent/8 blur-[70px] animate-float" />
        {/* Deep highlight — top center */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-secondary/8 blur-[120px]" />
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,26,62,0.4)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm md:mb-8">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          <span className="font-heading text-xs font-medium tracking-wider text-white/70 uppercase">
            AI-Powered Career Guidance
          </span>
        </div>

        <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Everyone deserves a career{" "}
          <br className="hidden sm:block" />
          <span className="inline-block text-transparent bg-clip-text bg-[linear-gradient(90deg,#2BBCB3,#4dd9d0)]">
            {displayText}
            <span
              className={`inline-block w-[3px] h-[0.85em] bg-secondary ml-0.5 align-middle ${
                isTyping ? "" : "animate-blink-cursor"
              }`}
            />
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg md:mt-8 md:text-xl">
          Meridian uses AI to provide the personalized career mentorship that
          was once reserved for the privileged few. No gatekeepers. No guesswork.
          Just honest guidance.
        </p>

        {/* CTA group */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-10">
          <a
            href="#how-it-works"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-4 font-heading text-base font-medium text-white shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 hover:bg-[#26a89f] transition-all min-h-[44px]"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#problem"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-heading text-base font-medium text-white/80 hover:bg-white/10 hover:border-white/25 backdrop-blur-sm transition-all min-h-[44px]"
          >
            Learn More
          </a>
        </div>

        {/* Decorative accent line */}
        <div className="mx-auto mt-14 flex items-center justify-center gap-3 md:mt-20">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
          <p className="text-xs text-white/30 font-heading tracking-wide">
            Built at HackASU 2026 &middot; Powered by Claude
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-snow to-transparent" />
    </section>
  );
}
