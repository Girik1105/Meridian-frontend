"use client";

import { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import type { CareerPath } from "@/types/career";

interface SelectConfirmationProps {
  path: CareerPath;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export default function SelectConfirmation({ path, onConfirm, onBack }: SelectConfirmationProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center animate-fade-in-up">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-light mb-5">
          <Sparkles className="h-7 w-7 text-secondary" />
        </div>

        <h2 className="font-heading text-xl font-bold text-ink mb-2">
          Great choice!
        </h2>
        <p className="font-body text-sm text-charcoal mb-6">
          You&apos;ve selected <strong className="font-heading font-semibold">{path.title}</strong>.
        </p>

        <div className="bg-white rounded-xl border border-silver/50 p-5 text-left mb-6">
          <h3 className="font-heading text-sm font-semibold text-ink mb-3">
            Here&apos;s what happens next:
          </h3>
          <ul className="space-y-2.5 font-body text-sm text-charcoal">
            <li className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
              We&apos;ll generate a personalized 30-minute skill taster for{" "}
              <strong className="font-heading font-medium">{path.required_skills[0]}</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
              You&apos;ll get hands-on experience before committing to a full learning plan
            </li>
          </ul>
        </div>

        <p className="font-body text-xs text-slate mb-4">
          Don&apos;t worry &mdash; you can always come back and switch to a different path later.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm & Continue"
            )}
          </button>
          <button
            onClick={onBack}
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm text-slate hover:text-charcoal font-heading font-medium transition-colors disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
