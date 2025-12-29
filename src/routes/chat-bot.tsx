import { createFileRoute } from "@tanstack/react-router";
import { chat, toServerSentEventsStream } from "@tanstack/ai";
import { ollamaText } from "@tanstack/ai-ollama";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { SendIcon } from "lucide-react";

// AI Elements Components
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Loader } from "@/components/ai-elements/loader";

export const Route = createFileRoute("/chat-bot")({
  component: RouteComponent,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();
        const abortController = new AbortController();

        console.log(messages);

        try {
          const stream = chat({
            adapter: ollamaText("gemini-3-flash-preview:cloud"),
            messages,
            abortController,
            systemPrompts: [
              'if user has question about "who are you?", you should answer that you are assistant of B3S Chat!',
            ],
          });

          const sseStream = toServerSentEventsStream(stream, abortController);

          return new Response(sseStream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Chat failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});

function RouteComponent() {
  const { messages, sendMessage, isLoading, error } = useChat({
    connection: fetchServerSentEvents("/chat-bot"),
  });

  const handleSubmit = ({ text }: { text: string }) => {
    if (text.trim() && !isLoading) {
      sendMessage(text);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Messages */}
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Welcome to B3S Chat"
              description="Start a conversation by typing a message below"
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, idx) => {
                    if (part.type === "thinking") {
                      return (
                        <Reasoning
                          key={idx}
                          isStreaming={
                            isLoading && idx === message.parts.length - 1
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.content}</ReasoningContent>
                        </Reasoning>
                      );
                    }
                    if (part.type === "text") {
                      return (
                        <MessageResponse key={idx}>
                          {part.content}
                        </MessageResponse>
                      );
                    }
                    return null;
                  })}
                  {isLoading &&
                    message.role === "assistant" &&
                    message.parts.length === 0 && (
                      <Loader className="text-muted-foreground" />
                    )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="border-t bg-background p-4">
        <PromptInput className="max-w-4xl mx-auto" onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <PromptInputTools>
            {isLoading ? (
              <Loader className="text-muted-foreground" size={20} />
            ) : (
              <PromptInputSubmit>
                <SendIcon className="size-4" />
              </PromptInputSubmit>
            )}
          </PromptInputTools>
        </PromptInput>
      </div>
    </div>
  );
}
