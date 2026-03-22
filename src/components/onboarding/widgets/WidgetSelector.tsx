"use client";

import { type ReactNode } from "react";
import SliderWidget from "./SliderWidget";
import MultiSelectWidget from "./MultiSelectWidget";
import SingleSelectWidget from "./SingleSelectWidget";
import FreeTextWidget from "./FreeTextWidget";
import CompositeWidget from "./CompositeWidget";

export interface WidgetSpec {
  type: "slider" | "single_select" | "multi_select" | "free_text" | "composite";
  label: string;
  field?: string;
  min?: number;
  max?: number;
  default?: number;
  min_label?: string;
  max_label?: string;
  step?: number;
  suffix?: string;
  options?: Array<string | { label: string; description?: string }>;
  min_selections?: number;
  max_selections?: number;
  placeholder?: string;
  fields?: WidgetSpec[];
}

interface WidgetSelectorProps {
  widgetSpec: WidgetSpec;
  onSend: (text: string) => void;
  onDismiss: () => void;
}

export default function WidgetSelector({ widgetSpec, onSend, onDismiss }: WidgetSelectorProps) {
  if (!widgetSpec) return null;

  return (
    <div className="px-3 pb-2 animate-fade-in-up">
      {renderWidget(widgetSpec, onSend)}
      <button
        onClick={onDismiss}
        className="mt-2 w-full text-center text-xs text-slate hover:text-charcoal font-body transition-colors py-1"
      >
        Prefer to type your own answer?
      </button>
    </div>
  );
}

function renderWidget(spec: WidgetSpec, onSend: (text: string) => void): ReactNode {
  switch (spec.type) {
    case "slider":
      return (
        <SliderWidget
          label={spec.label}
          min={spec.min ?? 1}
          max={spec.max ?? 10}
          defaultValue={spec.default}
          minLabel={spec.min_label}
          maxLabel={spec.max_label}
          suffix={spec.suffix}
          messageTemplate={(v) => {
            const field = spec.field || spec.label.toLowerCase();
            if (field.includes("confidence")) return `I'd rate my confidence at about ${v} out of ${spec.max ?? 10}`;
            if (field.includes("hours")) return `I can dedicate about ${v} hours per week`;
            if (field.includes("timeline")) return `I'm thinking about ${v} months`;
            return `For "${spec.label}", I'd say ${v}${spec.suffix || ""}`;
          }}
          onSend={onSend}
        />
      );

    case "single_select": {
      const opts = (spec.options ?? []).map((o) =>
        typeof o === "string" ? { label: o } : o
      );
      return (
        <SingleSelectWidget
          label={spec.label}
          options={opts}
          messageTemplate={(s) => {
            const field = spec.field || "";
            if (field.includes("education")) return `My education level is ${s.toLowerCase()}`;
            if (field.includes("budget")) return `My budget preference is ${s.toLowerCase()}`;
            if (field.includes("learning")) return `My learning style is ${s.toLowerCase()}`;
            return s;
          }}
          onSend={onSend}
        />
      );
    }

    case "multi_select": {
      const strOpts = (spec.options ?? []).map((o) =>
        typeof o === "string" ? o : o.label
      );
      return (
        <MultiSelectWidget
          label={spec.label}
          options={strOpts}
          messageTemplate={(selected) => {
            if (selected.length === 1) return `I'm most interested in ${selected[0]}`;
            const last = selected[selected.length - 1];
            const rest = selected.slice(0, -1).join(", ");
            return `I'm interested in ${rest} and ${last}`;
          }}
          onSend={onSend}
        />
      );
    }

    case "free_text":
      return (
        <FreeTextWidget
          placeholder={spec.placeholder || `Share your thoughts on: ${spec.label}`}
          onSend={onSend}
        />
      );

    case "composite":
      return (
        <CompositeWidget
          label={spec.label}
          fields={spec.fields ?? []}
          onSend={onSend}
        />
      );

    default:
      return null;
  }
}
