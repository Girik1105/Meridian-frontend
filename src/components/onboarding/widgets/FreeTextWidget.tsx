"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface FreeTextWidgetProps {
  placeholder?: string;
  onSend: (text: string) => void;
}

export default function FreeTextWidget({ placeholder = "Share your thoughts...", onSend }: FreeTextWidgetProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [value]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="bg-white border border-silver/50 rounded-xl p-4 shadow-sm animate-fade-in-up">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-lg border border-silver/50 bg-snow px-3 py-2.5 font-body text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors"
      />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate font-body">{value.length} characters</span>
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-heading font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </button>
      </div>
    </div>
  );
}
