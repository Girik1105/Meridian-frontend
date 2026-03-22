"use client";

import { useState } from "react";
import { type ReactElement } from "react";
import { Check, BookOpen, Code, MessageSquare, Globe, ExternalLink, Clock } from "lucide-react";
import type { TasterModule, TasterResponse } from "@/types/taster";

function renderMarkdownLite(text: string) {
  const parts: (string | ReactElement)[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++} className="font-heading font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {renderMarkdownLite(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

interface ModuleContentProps {
  module: TasterModule;
  response?: TasterResponse;
  onSubmit: (userResponse: string) => Promise<void>;
  submitting: boolean;
}

function ResourceTypeIcon({ type }: { type: string }) {
  const iconMap: Record<string, typeof BookOpen> = {
    article: BookOpen,
    tutorial: Code,
    video: BookOpen,
    exercise: Code,
    documentation: BookOpen,
  };
  const Icon = iconMap[type] || BookOpen;
  return (
    <div className="w-5 h-5 rounded bg-secondary-light flex items-center justify-center flex-shrink-0">
      <Icon className="h-3 w-3 text-secondary" />
    </div>
  );
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
        <div className="font-body text-sm text-charcoal leading-relaxed">
          {renderContent(module.content)}
        </div>
      </div>

      {/* Resources */}
      {module.resources && module.resources.length > 0 && (
        <div className="mb-4">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate mb-2 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            Related Resources
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {module.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-56 rounded-xl border border-silver/50 p-3 hover:border-secondary/40 hover:shadow-sm transition-all group bg-white"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <ResourceTypeIcon type={res.type} />
                  <span className="text-xs font-heading font-medium text-slate truncate">
                    {res.provider}
                  </span>
                </div>
                <p className="font-heading text-sm font-medium text-ink group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                  {res.title}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-xs font-heading text-slate">
                  <Clock className="h-3 w-3" />
                  ~{res.estimated_minutes} min
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

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
