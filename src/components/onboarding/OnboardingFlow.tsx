"use client";

import { useState, useCallback } from "react";
import { Compass, ChevronRight, Clock } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatThread from "./ChatThread";
import ChatInput from "./ChatInput";
import ProfileProgress from "./ProfileProgress";
import CompletionScreen from "./CompletionScreen";
import WidgetSelector from "./widgets/WidgetSelector";

interface OnboardingFlowProps {
  username: string;
  onComplete: () => void;
}

type Phase = "welcome" | "conversation" | "complete";

export default function OnboardingFlow({ username, onComplete }: OnboardingFlowProps) {
  const { messages, isStreaming, doneData, sendMessage } = useChat();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [dismissedAtCount, setDismissedAtCount] = useState(0);

  // Track previous doneData via useState (React-sanctioned derived state pattern)
  const [prevDoneData, setPrevDoneData] = useState(doneData);
  if (doneData !== prevDoneData) {
    setPrevDoneData(doneData);
    if (doneData?.profile_update && typeof doneData.profile_update === "object") {
      setProfileData((prev) => ({ ...prev, ...(doneData.profile_update as Record<string, unknown>) }));
    }
    if (doneData?.onboarding_completed === true && phase !== "complete") {
      setPhase("complete");
      onComplete();
    }
  }

  // Widget shows when: not streaming, last message is assistant, and messages have changed since dismissal
  const showWidget =
    !isStreaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages.length !== dismissedAtCount;

  const lastAssistantMessage = showWidget ? messages[messages.length - 1].content : "";

  const handleBegin = useCallback(() => {
    setPhase("conversation");
    sendMessage("Hi, I'd like to get started with my career exploration", "onboarding");
  }, [sendMessage]);

  const handleSend = useCallback(
    (text: string) => {
      setDismissedAtCount(messages.length);
      sendMessage(text, "onboarding");
    },
    [sendMessage, messages.length]
  );

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
    return <CompletionScreen profileData={profileData} username={username} />;
  }

  // Phase 2: Conversation
  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatThread messages={messages} isStreaming={isStreaming} />

        {/* Widget area */}
        {showWidget && lastAssistantMessage && (
          <WidgetSelector
            lastAssistantMessage={lastAssistantMessage}
            onSend={handleSend}
          />
        )}

        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          placeholder="Type your response..."
        />
      </div>

      {/* Profile progress sidebar */}
      <div className="md:w-80 md:border-l border-t md:border-t-0 border-silver/50 bg-snow p-4 md:overflow-y-auto">
        <ProfileProgress profileData={profileData} />
      </div>
    </div>
  );
}
