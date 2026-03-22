"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface MultiSelectWidgetProps {
  label: string;
  options: string[];
  messageTemplate: (selected: string[]) => string;
  onSend: (text: string) => void;
}

export default function MultiSelectWidget({
  label,
  options,
  messageTemplate,
  onSend,
}: MultiSelectWidgetProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customValue, setCustomValue] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  function toggle(option: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }

  function addCustom() {
    const trimmed = customValue.trim();
    if (trimmed) {
      setSelected((prev) => new Set(prev).add(trimmed));
      setCustomValue("");
      setShowCustom(false);
    }
  }

  function handleSend() {
    if (selected.size === 0) return;
    onSend(messageTemplate(Array.from(selected)));
  }

  return (
    <div className="bg-white border border-silver/50 rounded-xl p-4 shadow-sm animate-fade-in-up">
      <p className="text-sm font-heading font-medium text-charcoal mb-3">{label}</p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggle(option)}
            className={`px-3 py-1.5 rounded-full text-sm font-heading font-medium border transition-all duration-200 ${
              selected.has(option)
                ? "bg-secondary-light border-secondary text-primary"
                : "bg-white border-silver text-charcoal hover:border-slate"
            }`}
          >
            {option}
          </button>
        ))}

        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="px-3 py-1.5 rounded-full text-sm font-heading font-medium border border-dashed border-silver text-slate hover:border-secondary hover:text-secondary transition-colors"
          >
            + Other
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="Type here..."
              autoFocus
              className="px-3 py-1.5 rounded-full text-sm font-body border border-secondary/50 bg-snow focus:outline-none focus:border-secondary w-32"
            />
            <button
              onClick={addCustom}
              className="text-xs text-secondary font-heading font-medium hover:underline"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleSend}
        disabled={selected.size === 0}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-sm font-heading font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
