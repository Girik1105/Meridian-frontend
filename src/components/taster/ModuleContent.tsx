"use client";

import { useState } from "react";
import { Check, BookOpen, Code, MessageSquare } from "lucide-react";
import type { TasterModule, TasterResponse } from "@/types/taster";

interface ModuleContentProps {
  module: TasterModule;
  response?: TasterResponse;
  onSubmit: (userResponse: string) => Promise<void>;
  submitting: boolean;
}

const TYPE_CONFIG = {
  read: { icon: BookOpen, label: "Reading", submitText: "Mark as Read" },
  exercise: { icon: Code, label: "Exercise", submitText: "Submit Response" },
  reflect: { icon: MessageSquare, label: "Reflection", submitText: "Submit Reflection" },
};

export default function ModuleContent({
  module,
  response,
  onSubmit,
  submitting,
}: ModuleContentProps) {
  const [text, setText] = useState(response?.user_response ?? "");
  const [editing, setEditing] = useState(false);
  const config = TYPE_CONFIG[module.type];
  const Icon = config.icon;
  const completed = !!response && !editing;

  async function handleSubmit() {
    const value = module.type === "read" ? "read" : text.trim();
    if (!value) return;
    await onSubmit(value);
    setEditing(false);
  }

  return (
    <div className="animate-fade-in-up">
      {/* Module header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center">
          <Icon className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate">
            {config.label}
          </span>
          <h2 className="font-heading text-lg font-bold text-ink">
            {module.title}
          </h2>
        </div>
        <span className="ml-auto text-xs font-heading text-slate">
          ~{module.estimated_minutes} min
        </span>
      </div>

      {/* Module content */}
      <div className="bg-white rounded-2xl border border-silver/50 p-5 shadow-sm mb-4">
        <div className="font-body text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
          {module.content}
        </div>
      </div>

      {/* Completed state */}
      {completed && (
        <div className="bg-success-light rounded-2xl border border-success/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-4 w-4 text-success" />
            <span className="font-heading text-sm font-semibold text-success">
              Completed
            </span>
          </div>
          {response.user_response !== "read" && (
            <p className="font-body text-sm text-charcoal leading-relaxed">
              {response.user_response}
            </p>
          )}
          <button
            onClick={() => {
              setEditing(true);
              setText(response.user_response === "read" ? "" : response.user_response);
            }}
            className="mt-2 text-xs font-heading font-medium text-secondary hover:text-secondary/80 transition-colors"
          >
            Edit response
          </button>
        </div>
      )}

      {/* Input area */}
      {!completed && (
        <>
          {module.type !== "read" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                module.type === "exercise"
                  ? "Write your response here..."
                  : "Share your thoughts..."
              }
              rows={5}
              className="w-full rounded-xl border border-silver/50 p-4 font-body text-sm text-ink placeholder:text-slate focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 resize-none mb-4"
            />
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || (module.type !== "read" && !text.trim())}
            className="w-full py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              config.submitText
            )}
          </button>
        </>
      )}
    </div>
  );
}
