"use client";

import { useState, useCallback, useRef } from "react";
import { apiFetch, streamChat } from "@/lib/api";

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [doneData, setDoneData] = useState<Record<string, unknown> | null>(
    null
  );
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (
      text: string,
      conversationType: string = "onboarding",
      metadata?: Record<string, unknown>,
      resetConversation?: boolean
    ) => {
      const activeConvId = resetConversation ? null : conversationId;

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsStreaming(true);
      setDoneData(null);
      abortRef.current = false;

      try {
        // Step 1: POST the message
        const sendRes = await apiFetch("/chat/send/", {
          method: "POST",
          body: JSON.stringify({
            conversation_id: activeConvId,
            conversation_type: conversationType,
            message: text,
            ...(metadata && Object.keys(metadata).length > 0
              ? { metadata }
              : {}),
          }),
        });

        if (!sendRes.ok) throw new Error("Failed to send message");
        const { conversation_id: convId } = await sendRes.json();
        setConversationId(convId);

        // Step 2: Stream the response
        let assistantText = "";
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        await streamChat(convId, {
          onToken: (token) => {
            if (abortRef.current) return;
            assistantText += token;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantText,
              };
              return updated;
            });
          },
          onDone: (data) => {
            setDoneData(data);
            if (data.message_id) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  id: data.message_id as string,
                };
                return updated;
              });
            }
          },
          onError: (error) => {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: `Error: ${error}`,
              };
              return updated;
            });
          },
        });
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
          },
        ]);
      } finally {
        setIsStreaming(false);
      }
    },
    [conversationId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setDoneData(null);
  }, []);

  const restoreConversation = useCallback(
    (restoredConversationId: string, existingMessages: ChatMessage[]) => {
      setConversationId(restoredConversationId);
      setMessages(existingMessages);
      setDoneData(null);
    },
    []
  );

  return { messages, isStreaming, conversationId, doneData, sendMessage, clearMessages, restoreConversation };
}
