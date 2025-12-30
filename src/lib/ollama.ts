import { Ollama, type Message } from "ollama";

const ollama = new Ollama({
  host: "http://localhost:11434",
});

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  thinking?: boolean | "high" | "medium" | "low";
};

export type StreamChunk = {
  content: string;
  thinking?: boolean | "high" | "medium" | "low";
  done: boolean;
};

export async function* streamChat(
  messages: ChatMessage[],
  model = "gemini-3-pro-preview:latest"
): AsyncGenerator<StreamChunk> {
  const ollamaMessages: Message[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
    think: m.thinking,
  }));

  const response = await ollama.chat({
    model,
    messages: ollamaMessages,
    stream: true,
    think: true,
  });

  for await (const part of response) {
    yield {
      content: part.message.content,
      thinking: part.message.thinking as boolean | "high" | "medium" | "low",
      done: part.done,
    };
  }
}

export { ollama };
