"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { type WidgetSpec } from "./WidgetSelector";

interface CompositeWidgetProps {
  label: string;
  fields: WidgetSpec[];
  onSend: (text: string) => void;
}

export default function CompositeWidget({ label, fields, onSend }: CompositeWidgetProps) {
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    for (const f of fields) {
      const key = f.field || f.label;
      if (f.type === "slider") init[key] = f.default ?? Math.round(((f.min ?? 1) + (f.max ?? 10)) / 2);
      else init[key] = "";
    }
    return init;
  });

  function setValue(key: string, val: string | number) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  const allFilled = fields.every((f) => {
    const key = f.field || f.label;
    const v = values[key];
    return v !== "" && v !== undefined;
  });

  function handleSubmit() {
    if (!allFilled) return;
    const parts: string[] = [];
    for (const f of fields) {
      const key = f.field || f.label;
      const v = values[key];
      if (f.type === "slider") {
        if (key.includes("hours")) parts.push(`I can dedicate about ${v} hours per week`);
        else if (key.includes("timeline")) parts.push(`I'm thinking about ${v} months`);
        else parts.push(`For ${f.label.toLowerCase()}, I'd say ${v}${f.suffix || ""}`);
      } else {
        parts.push(String(v));
      }
    }
    onSend(parts.join(". ") + ".");
  }

  return (
    <div className="bg-white border border-silver/50 rounded-xl p-3 shadow-sm animate-fade-in-up">
      <p className="text-sm font-heading font-medium text-charcoal mb-3">{label}</p>

      <div className="space-y-4">
        {fields.map((f) => {
          const key = f.field || f.label;
          return (
            <div key={key}>
              {f.type === "slider" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate font-body">{f.label}</span>
                    <span className="text-sm font-heading font-bold text-primary">
                      {values[key]}{f.suffix || ""}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={f.min ?? 1}
                    max={f.max ?? 10}
                    step={f.step ?? 1}
                    value={Number(values[key])}
                    onChange={(e) => setValue(key, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-secondary"
                    style={{
                      background: `linear-gradient(to right, var(--color-secondary) 0%, var(--color-secondary) ${((Number(values[key]) - (f.min ?? 1)) / ((f.max ?? 10) - (f.min ?? 1))) * 100}%, var(--color-silver) ${((Number(values[key]) - (f.min ?? 1)) / ((f.max ?? 10) - (f.min ?? 1))) * 100}%, var(--color-silver) 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-slate font-body">{f.min_label || f.min}</span>
                    <span className="text-[10px] text-slate font-body">{f.max_label || f.max}</span>
                  </div>
                </div>
              )}

              {f.type === "single_select" && (
                <div>
                  <span className="text-xs text-slate font-body block mb-1.5">{f.label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(f.options ?? []).map((opt) => {
                      const optLabel = typeof opt === "string" ? opt : opt.label;
                      const selected = values[key] === optLabel;
                      return (
                        <button
                          key={optLabel}
                          onClick={() => setValue(key, optLabel)}
                          className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium border transition-all duration-200 ${
                            selected
                              ? "bg-secondary-light border-secondary text-primary"
                              : "bg-white border-silver text-charcoal hover:border-slate"
                          }`}
                        >
                          {optLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {f.type === "multi_select" && (
                <div>
                  <span className="text-xs text-slate font-body block mb-1.5">{f.label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(f.options ?? []).map((opt) => {
                      const optLabel = typeof opt === "string" ? opt : opt.label;
                      const currentVal = String(values[key] || "");
                      const selectedItems = currentVal ? currentVal.split(", ") : [];
                      const isSelected = selectedItems.includes(optLabel);
                      return (
                        <button
                          key={optLabel}
                          onClick={() => {
                            const next = isSelected
                              ? selectedItems.filter((i) => i !== optLabel)
                              : [...selectedItems, optLabel];
                            setValue(key, next.join(", "));
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium border transition-all duration-200 ${
                            isSelected
                              ? "bg-secondary-light border-secondary text-primary"
                              : "bg-white border-silver text-charcoal hover:border-slate"
                          }`}
                        >
                          {optLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {f.type === "free_text" && (
                <div>
                  <span className="text-xs text-slate font-body block mb-1.5">{f.label}</span>
                  <input
                    type="text"
                    value={String(values[key])}
                    onChange={(e) => setValue(key, e.target.value)}
                    placeholder={f.placeholder || ""}
                    className="w-full px-3 py-2 rounded-lg border border-silver/50 bg-snow text-sm font-body text-ink placeholder:text-slate/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allFilled}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-sm font-heading font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
