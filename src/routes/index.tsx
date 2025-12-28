import { createFileRoute } from "@tanstack/react-router";
import { CopyIcon, RefreshCcwIcon, Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
};

type ChatStatus = "idle" | "submitted" | "streaming";

export const Route = createFileRoute("/")({ component: ChatApp });

function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingThinking, setStreamingThinking] = useState("");
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim() || status !== "idle") return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message.text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatus("submitted");
    setStreamingContent("");
    setStreamingThinking("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let fullContent = "";
      let fullThinking = "";

      setStatus("streaming");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const chunk = JSON.parse(data);
              if (chunk.content) {
                fullContent += chunk.content;
                setStreamingContent(fullContent);
              }
              if (chunk.thinking) {
                fullThinking += chunk.thinking;
                setStreamingThinking(fullThinking);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: fullContent,
        thinking: fullThinking || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setStatus("idle");
      setStreamingContent("");
      setStreamingThinking("");
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;

    // Remove last assistant message and regenerate
    const newMessages = messages.slice(0, -1);
    const lastUserMessage = newMessages[newMessages.length - 1];

    if (lastUserMessage?.role !== "user") return;

    setMessages(newMessages);
    await handleSubmit({ text: lastUserMessage.content, files: [] });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="font-semibold">Marv Chat</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={theme === "light" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTheme("light")}
              title="Light mode"
            >
              <Sun className="size-4" />
            </Button>
            <Button
              variant={theme === "dark" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTheme("dark")}
              title="Dark mode"
            >
              <Moon className="size-4" />
            </Button>
            <Button
              variant={theme === "system" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setTheme("system")}
              title="System mode"
            >
              <Monitor className="size-4" />
            </Button>
          </div>
        </header>
        <div className="flex flex-col h-[calc(100vh-65px)] w-full px-6">
          <Conversation className="h-full">
            <ConversationContent>
              {messages.length === 0 && (
                <ConversationEmptyState
                  icon={<span className="text-4xl"></span>}
                  title="Marv Chat"
                  description="Start a conversation with the AI"
                />
              )}

              {messages.map((message, index) => (
                <div key={message.id}>
                  {/* Reasoning section for assistant messages */}
                  {message.role === "assistant" && message.thinking && (
                    <Reasoning isStreaming={false}>
                      <ReasoningTrigger />
                      <ReasoningContent>{message.thinking}</ReasoningContent>
                    </Reasoning>
                  )}

                  {/* Message content */}
                  <Message from={message.role}>
                    <MessageContent>
                      <MessageResponse>{message.content}</MessageResponse>
                    </MessageContent>

                    {/* Actions for assistant messages */}
                    {message.role === "assistant" && (
                      <MessageActions>
                        {index === messages.length - 1 && (
                          <MessageAction onClick={handleRegenerate} label="Retry">
                            <RefreshCcwIcon className="size-3" />
                          </MessageAction>
                        )}
                        <MessageAction
                          onClick={() => copyToClipboard(message.content)}
                          label="Copy"
                        >
                          <CopyIcon className="size-3" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Message>
                </div>
              ))}

              {/* Streaming state */}
              {status !== "idle" && (
                <>
                  {streamingThinking && (
                    <Reasoning isStreaming={status === "streaming"}>
                      <ReasoningTrigger />
                      <ReasoningContent>{streamingThinking}</ReasoningContent>
                    </Reasoning>
                  )}

                  {streamingContent ? (
                    <Message from="assistant">
                      <MessageContent>
                        <MessageResponse>{streamingContent}</MessageResponse>
                      </MessageContent>
                    </Message>
                  ) : (
                    status === "submitted" && <Loader />
                  )}
                </>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <PromptInput onSubmit={handleSubmit} className="mt-4">
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={status !== "idle"}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled={!input.trim()} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </SidebarInset>
    </>
  );
}
