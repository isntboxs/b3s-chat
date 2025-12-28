import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
};

export const Route = createFileRoute("/")({ component: ChatApp });

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingThinking, setStreamingThinking] = useState("");
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
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

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: fullContent,
        thinking: fullThinking || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
      setStreamingThinking("");
    }
  };

  const toggleThinking = (id: string) => {
    setShowThinking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>💬 Ollama Chat</h1>
        <span className="model-badge">gpt-oss:120b</span>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <p>Start a conversation with the AI</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              {message.thinking && (
                <div className="thinking-section">
                  <button
                    className="thinking-toggle"
                    onClick={() => toggleThinking(message.id)}
                  >
                    💭 Thinking {showThinking[message.id] ? "▼" : "▶"}
                  </button>
                  {showThinking[message.id] && (
                    <div className="thinking-content">
                      <Streamdown>{message.thinking}</Streamdown>
                    </div>
                  )}
                </div>
              )}
              <div className="message-text">
                <Streamdown>{message.content}</Streamdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant streaming">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              {streamingThinking && (
                <div className="thinking-section">
                  <button
                    className="thinking-toggle"
                    onClick={() => toggleThinking("streaming")}
                  >
                    💭 Thinking {showThinking["streaming"] ? "▼" : "▶"}
                  </button>
                  {showThinking["streaming"] && (
                    <div className="thinking-content">{streamingThinking}</div>
                  )}
                </div>
              )}
              <div className="message-text">
                {streamingContent || (
                  <span className="typing-indicator">●●●</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
