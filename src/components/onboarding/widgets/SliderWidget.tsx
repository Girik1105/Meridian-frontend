"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface SliderWidgetProps {
  label: string;
  min: number;
  max: number;
  defaultValue?: number;
  minLabel?: string;
  maxLabel?: string;
  suffix?: string;
  messageTemplate: (value: number) => string;
  onSend: (text: string) => void;
}

export default function SliderWidget({
  label,
  min,
  max,
  defaultValue,
  minLabel,
  maxLabel,
  suffix = "",
  messageTemplate,
  onSend,
}: SliderWidgetProps) {
  const [value, setValue] = useState(defaultValue ?? Math.round((min + max) / 2));

  return (
    <div className="bg-white border border-silver/50 rounded-xl p-4 shadow-sm animate-fade-in-up">
      <p className="text-sm font-heading font-medium text-charcoal mb-3">{label}</p>

      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          {minLabel && <span className="text-xs text-slate font-body">{minLabel}</span>}
          <span className="text-lg font-heading font-bold text-primary ml-auto">
            {value}{suffix}
          </span>
          {maxLabel && <span className="text-xs text-slate font-body ml-auto">{maxLabel}</span>}
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-secondary"
          style={{
            background: `linear-gradient(to right, var(--color-secondary) 0%, var(--color-secondary) ${((value - min) / (max - min)) * 100}%, var(--color-silver) ${((value - min) / (max - min)) * 100}%, var(--color-silver) 100%)`,
          }}
        />

        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate font-body">{min}{suffix}</span>
          <span className="text-xs text-slate font-body">{max}{suffix}</span>
        </div>
      </div>

      <button
        onClick={() => onSend(messageTemplate(value))}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-sm font-heading font-medium hover:bg-primary/90 transition-colors"
      >
        Continue
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
