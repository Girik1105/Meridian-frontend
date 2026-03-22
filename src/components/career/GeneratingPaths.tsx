"use client";

import { useState, useEffect } from "react";
import { Compass } from "lucide-react";

const STATUS_MESSAGES = [
  "Analyzing your background and skills...",
  "Matching interests with career opportunities...",
  "Evaluating time and budget constraints...",
  "Calculating ROI for each path...",
  "Finalizing personalized recommendations...",
];

export default function GeneratingPaths() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progressStarted, setProgressStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Trigger progress bar fill after mount
    const timer = setTimeout(() => setProgressStarted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center animate-fade-in-up">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-light mb-6 animate-float">
          <Compass className="h-8 w-8 text-secondary" />
        </div>

        <h2 className="font-heading text-xl font-bold text-ink mb-2">
          Discovering your career paths...
        </h2>

        <p className="font-body text-sm text-secondary min-h-[2.5rem] transition-opacity duration-300">
          {STATUS_MESSAGES[messageIndex]}
        </p>

        {/* Progress bar */}
        <div className="mt-6 mx-auto w-64 h-1.5 rounded-full bg-silver/30 overflow-hidden">
          <div
            className="h-full rounded-full bg-secondary transition-all ease-linear"
            style={{
              width: progressStarted ? "100%" : "0%",
              transitionDuration: "8s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
