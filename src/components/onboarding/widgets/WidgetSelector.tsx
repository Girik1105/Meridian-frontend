"use client";

import { type ReactNode } from "react";
import SliderWidget from "./SliderWidget";
import MultiSelectWidget from "./MultiSelectWidget";
import SingleSelectWidget from "./SingleSelectWidget";

interface WidgetSelectorProps {
  lastAssistantMessage: string;
  onSend: (text: string) => void;
}

const INTEREST_OPTIONS = [
  "Technology", "Healthcare", "Education", "Business", "Design",
  "Science", "Arts", "Engineering", "Finance", "Social Work",
  "Media", "Environment", "Law", "Marketing",
];

const DEAL_BREAKER_OPTIONS = [
  "Long hours", "Low pay", "No remote work", "High stress",
  "Requires relocation", "Slow growth", "Repetitive tasks",
  "Extensive travel", "No creativity", "Rigid hierarchy",
];

const EDUCATION_OPTIONS = [
  { label: "High school", description: "High school diploma or equivalent" },
  { label: "Some college", description: "Started but didn't finish a degree" },
  { label: "Associate's degree", description: "2-year degree" },
  { label: "Bachelor's degree", description: "4-year degree" },
  { label: "Master's degree", description: "Graduate-level degree" },
  { label: "Doctoral degree", description: "PhD or equivalent" },
  { label: "Self-taught / Bootcamp", description: "Non-traditional education" },
];

const BUDGET_OPTIONS = [
  { label: "Free only", description: "Only free resources and courses" },
  { label: "Low budget", description: "Up to $50/month for learning" },
  { label: "Flexible", description: "Willing to invest in quality education" },
];

const LEARNING_STYLE_OPTIONS = [
  { label: "Very hands-on", description: "I learn by doing projects and building things" },
  { label: "Balanced", description: "Mix of reading, videos, and practice" },
  { label: "Mostly reading/videos", description: "I prefer absorbing material first, then applying" },
];

type WidgetMatch = {
  keywords: string[];
  render: (onSend: (text: string) => void) => ReactNode;
};

const WIDGET_RULES: WidgetMatch[] = [
  {
    keywords: ["confidence", "scale of", "1 to 10", "one to ten", "rate yourself"],
    render: (onSend) => (
      <SliderWidget
        label="How confident are you about your career direction?"
        min={1}
        max={10}
        defaultValue={5}
        minLabel="Not sure at all"
        maxLabel="Very confident"
        messageTemplate={(v) => `I'd rate my confidence at about ${v} out of 10`}
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["interests", "passionate", "curious about", "excited about", "drawn to"],
    render: (onSend) => (
      <MultiSelectWidget
        label="Select the areas that interest you"
        options={INTEREST_OPTIONS}
        messageTemplate={(s) =>
          `I'm interested in ${s.slice(0, -1).join(", ")}${s.length > 1 ? " and " : ""}${s[s.length - 1]}`
        }
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["education", "degree", "studied", "academic background", "school"],
    render: (onSend) => (
      <SingleSelectWidget
        label="What's your education level?"
        options={EDUCATION_OPTIONS}
        messageTemplate={(s) => `My education level is ${s.toLowerCase()}`}
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["hours", "time per week", "time each week", "dedicate per week", "spare time"],
    render: (onSend) => (
      <SliderWidget
        label="How many hours per week can you dedicate?"
        min={1}
        max={40}
        defaultValue={10}
        suffix=" hrs"
        messageTemplate={(v) => `I can dedicate about ${v} hours per week to learning`}
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["budget", "spend", "invest in learning", "afford"],
    render: (onSend) => (
      <SingleSelectWidget
        label="What's your learning budget?"
        options={BUDGET_OPTIONS}
        messageTemplate={(s) => `My budget preference is ${s.toLowerCase()}`}
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["timeline", "months", "how long", "how soon", "timeframe"],
    render: (onSend) => (
      <SliderWidget
        label="What's your ideal timeline?"
        min={1}
        max={24}
        defaultValue={6}
        suffix=" months"
        minLabel="1 month"
        maxLabel="2 years"
        messageTemplate={(v) => `I'm thinking a timeline of about ${v} months`}
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["deal breaker", "dealbreaker", "absolutely not", "avoid", "non-negotiable"],
    render: (onSend) => (
      <MultiSelectWidget
        label="Any deal breakers?"
        options={DEAL_BREAKER_OPTIONS}
        messageTemplate={(s) =>
          `My deal breakers would be ${s.slice(0, -1).join(", ")}${s.length > 1 ? " and " : ""}${s[s.length - 1].toLowerCase()}`
        }
        onSend={onSend}
      />
    ),
  },
  {
    keywords: ["learning style", "hands-on", "learn best", "prefer to learn", "reading or doing"],
    render: (onSend) => (
      <SingleSelectWidget
        label="How do you prefer to learn?"
        options={LEARNING_STYLE_OPTIONS}
        messageTemplate={(s) => `My learning style is ${s.toLowerCase()}`}
        onSend={onSend}
      />
    ),
  },
];

export default function WidgetSelector({ lastAssistantMessage, onSend }: WidgetSelectorProps) {
  if (!lastAssistantMessage) return null;

  const lower = lastAssistantMessage.toLowerCase();

  for (const rule of WIDGET_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return <div className="px-4 pb-2">{rule.render(onSend)}</div>;
    }
  }

  return null;
}
