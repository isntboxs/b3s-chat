import { chat, toServerSentEventsStream } from "@tanstack/ai";
import { ollamaText } from "@tanstack/ai-ollama";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ollama-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, conversationId } = await request.json();
        const abortController = new AbortController();

        try {
          const stream = chat({
            adapter: ollamaText("gpt-oss:120b-cloud"),
            messages,
            conversationId,
            abortController,
          });

          const readableStream = toServerSentEventsStream(
            stream,
            abortController
          );

          return new Response(readableStream);
        } catch (error) {
          console.log(error);
        }
      },
    },
  },
});
