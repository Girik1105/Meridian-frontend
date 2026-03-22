"use client";

import { useState, useCallback, useEffect } from "react";
import { Compass, ChevronRight, Clock } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { getConversations, getConversationDetail } from "@/lib/api";
import ChatThread from "./ChatThread";
import ChatInput from "./ChatInput";
import ProfileProgress from "./ProfileProgress";
import CompletionScreen from "./CompletionScreen";
import WidgetSelector, { type WidgetSpec } from "./widgets/WidgetSelector";

interface OnboardingFlowProps {
  username: string;
  onComplete: () => void;
}

type Phase = "welcome" | "conversation" | "complete";

export default function OnboardingFlow({ username, onComplete }: OnboardingFlowProps) {
  const { messages, isStreaming, doneData, sendMessage, restoreConversation } = useChat();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [currentWidget, setCurrentWidget] = useState<WidgetSpec | null>(null);
  const [widgetDismissed, setWidgetDismissed] = useState(false);
  const [restoring, setRestoring] = useState(true);

  // Restore existing onboarding conversation on mount
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      try {
        const conversations = await getConversations("onboarding");
        if (cancelled) return;

        // Find the most recent active onboarding conversation
        const active = conversations.find(
          (c: { is_active: boolean }) => c.is_active
        );
        if (!active) {
          setRestoring(false);
          return;
        }

        const detail = await getConversationDetail(active.id);
        if (cancelled) return;

        if (detail.messages && detail.messages.length > 0) {
          // Convert backend messages to ChatMessage format (skip system messages)
          const chatMessages = detail.messages
            .filter((m: { role: string }) => m.role !== "system")
            .map((m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
            }));

          restoreConversation(active.id, chatMessages);
          setPhase("conversation");

          // Restore profile data from message metadata
          for (const msg of [...detail.messages].reverse()) {
            if (msg.metadata?.profile_update) {
              setProfileData(msg.metadata.profile_update as Record<string, unknown>);
              break;
            }
          }
        }
      } catch {
        // If restoration fails, just show welcome screen
      } finally {
        if (!cancelled) setRestoring(false);
      }
    }
    restore();
    return () => { cancelled = true; };
  }, [restoreConversation]);

  // Track previous doneData via useState (React-sanctioned derived state pattern)
  const [prevDoneData, setPrevDoneData] = useState(doneData);
  if (doneData !== prevDoneData) {
    setPrevDoneData(doneData);
    if (doneData?.profile_update && typeof doneData.profile_update === "object") {
      setProfileData((prev) => ({ ...prev, ...(doneData.profile_update as Record<string, unknown>) }));
    }
    if (doneData?.onboarding_completed === true && phase !== "complete") {
      setPhase("complete");
    }
    setCurrentWidget((doneData?.widget as WidgetSpec) ?? null);
    setWidgetDismissed(false);
  }

  const showWidget = !isStreaming && currentWidget !== null && !widgetDismissed;

  const handleBegin = useCallback(() => {
    setPhase("conversation");
    sendMessage("Hi, I'd like to get started with my career exploration", "onboarding");
  }, [sendMessage]);

  const handleSend = useCallback(
    (text: string) => {
      setCurrentWidget(null);
      setWidgetDismissed(false);
      sendMessage(text, "onboarding");
    },
    [sendMessage]
  );

  const handleWidgetDismiss = useCallback(() => {
    setWidgetDismissed(true);
  }, []);

  // Loading: restoring previous conversation
  if (restoring) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-8 w-8 text-secondary animate-spin" />
          <span className="text-slate font-body text-sm">Loading your conversation...</span>
        </div>
      </div>
    );
  }

  // Phase 1: Welcome
  if (phase === "welcome") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6 animate-float">
            <Compass className="h-8 w-8 text-primary" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-ink mb-3">
            Welcome to Meridian, {username}
          </h1>
          <p className="font-body text-slate leading-relaxed mb-8">
            Let&apos;s get to know you so we can find career paths tailored to your
            background, interests, and goals. You&apos;ll have a quick chat with your
            AI mentor — just be yourself.
          </p>

          <button
            onClick={handleBegin}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-heading font-medium text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Let&apos;s Begin
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-slate">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-body">Takes about 5 minutes</span>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: Complete
  if (phase === "complete") {
    return (
      <div className="flex-1 overflow-hidden flex flex-col">
        <CompletionScreen
          profileData={profileData}
          username={username}
          onContinue={onComplete}
        />
      </div>
    );
  }

  // Phase 2: Conversation
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Profile progress — horizontal top bar */}
      <div className="flex-shrink-0">
        <ProfileProgress profileData={profileData} />
      </div>

      {/* Chat thread */}
      <ChatThread messages={messages} isStreaming={isStreaming} />

      {/* Widget or chat input */}
      <div className="flex-shrink-0">
        {showWidget ? (
          <WidgetSelector
            widgetSpec={currentWidget!}
            onSend={handleSend}
            onDismiss={handleWidgetDismiss}
          />
        ) : (
          <ChatInput
            onSend={handleSend}
            disabled={isStreaming}
            placeholder="Type your response..."
          />
        )}
      </div>
    </div>
  );
}
