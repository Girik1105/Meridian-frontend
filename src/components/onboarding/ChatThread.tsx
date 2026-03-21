"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatThreadProps {
  messages: Message[];
  isStreaming: boolean;
}

export default function ChatThread({ messages, isStreaming }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg, i) => (
        <ChatMessage
          key={msg.id ?? i}
          role={msg.role}
          content={msg.content}
          animate={i >= messages.length - 2}
        />
      ))}

      {isStreaming && messages[messages.length - 1]?.content === "" && (
        <div className="flex gap-3 animate-fade-in-up">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-secondary animate-spin" />
          </div>
          <div className="bg-white border border-silver/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-silver rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-silver rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-silver rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
