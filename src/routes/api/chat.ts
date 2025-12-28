import { createFileRoute } from "@tanstack/react-router";
import { streamChat, type ChatMessage } from "@/lib/ollama";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const messages: ChatMessage[] = body.messages || [];
        const model: string = body.model || "gpt-oss:120b";

        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();

            try {
              for await (const chunk of streamChat(messages, model)) {
                const data = JSON.stringify(chunk);
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));

                if (chunk.done) {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
              }
            } catch (error) {
              const errorData = JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
              });
              controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
