"use client";

import { useState, useEffect, useRef } from "react";
import { type ReactElement } from "react";
import { HelpCircle, X, Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";

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
      parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
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

interface TasterHelpPanelProps {
  tasterId: string;
  moduleId: string;
  moduleName: string;
  skillName: string;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_CHIPS = [
  "Explain this in simpler terms",
  "Give me a hint",
  "Show me an example",
];

export default function TasterHelpPanel({
  tasterId,
  moduleId,
  moduleName,
  skillName,
  isOpen,
  onClose,
}: TasterHelpPanelProps) {
  const { messages, isStreaming, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when module changes
  useEffect(() => {
    clearMessages();
  }, [moduleId, clearMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;
    sendMessage(msg, "skill_taster", {
      taster_id: tasterId,
      module_id: moduleId,
    });
    setInput("");
  }

  const visibleMessages = messages.filter(
    (m) => m.content || m.role === "user"
  );

  // --- Desktop panel ---
  const panel = (
    <div className="flex flex-col h-full bg-white border-l-2 border-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-silver/50">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-secondary shrink-0" />
            <span className="font-heading text-sm font-semibold text-ink">
              Need Help?
            </span>
          </div>
          <p className="text-xs text-slate font-body mt-0.5 truncate">
            {moduleName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate hover:text-ink transition-colors shrink-0 ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <HelpCircle className="h-10 w-10 text-secondary/20 mb-3" />
            <p className="font-heading text-sm font-medium text-charcoal mb-1">
              Ask me anything
            </p>
            <p className="font-body text-xs text-slate mb-4">
              about this {skillName} module
            </p>
            <div className="flex flex-col gap-2 w-full">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 rounded-full bg-secondary-light text-secondary text-xs font-heading font-medium hover:bg-secondary/20 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          visibleMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-secondary text-white font-body"
                    : "bg-cloud text-charcoal font-body"
                }`}
              >
                {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
              </div>
            </div>
          ))
        )}
        {isStreaming && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start">
            <div className="bg-cloud rounded-xl px-3 py-2 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-slate/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-slate/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-silver/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type your question..."
            disabled={isStreaming}
            className="flex-1 border border-silver/50 rounded-xl px-3 py-2 text-sm font-body focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 outline-none disabled:opacity-50 bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className="p-2 rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: side panel */}
      <div
        className={`hidden md:block w-80 flex-shrink-0 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-w-80" : "max-w-0"
        }`}
      >
        {isOpen && panel}
      </div>

      {/* Mobile: bottom sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={onClose}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] bg-white rounded-t-2xl shadow-lg flex flex-col animate-fade-in-up">
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-silver" />
            </div>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
