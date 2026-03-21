"use client";

import { type ReactElement } from "react";
import { Compass } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  animate?: boolean;
}

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
      parts.push(<strong key={key++}>{match[2]}</strong>);
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

export default function ChatMessage({ role, content, animate = true }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} ${
        animate ? "animate-fade-in-up" : ""
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
          <Compass className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 font-body text-[15px] leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-br-md"
            : "bg-white border border-silver/50 text-charcoal rounded-bl-md shadow-sm"
        }`}
      >
        {renderContent(content)}
      </div>
    </div>
  );
}
