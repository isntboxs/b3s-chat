import { useContext } from "react";
import { ChatHistoryContext } from "@/components/providers/chat-history-provider";

export function useChatHistory() {
  const context = useContext(ChatHistoryContext);
  
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  
  return context;
}
