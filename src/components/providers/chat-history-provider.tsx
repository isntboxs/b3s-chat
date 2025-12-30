"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-provider";
import {
  createChatSession,
  getChatSessions,
  getChatMessages,
  saveChatMessage,
  updateSessionTitle,
  deleteSession,
  generateSessionTitle,
  togglePinSession,
  type ChatSession,
  type ChatMessage,
  type CreateMessageInput,
} from "@/lib/chat-history";

interface ChatHistoryContextType {
  currentSessionId: string | null;
  sessions: ChatSession[];
  currentMessages: ChatMessage[];
  isLoading: boolean;
  createNewChat: () => Promise<void>;
  loadChat: (sessionId: string) => Promise<void>;
  saveMessage: (message: CreateMessageInput) => Promise<void>;
  refreshSessions: () => Promise<void>;
  deleteChat: (sessionId: string) => Promise<void>;
  updateTitle: (sessionId: string, title: string) => Promise<void>;
  togglePin: (sessionId: string) => Promise<void>;
}

export const ChatHistoryContext = createContext<ChatHistoryContextType | null>(
  null
);

interface ChatHistoryProviderProps {
  children: React.ReactNode;
}

export function ChatHistoryProvider({ children }: ChatHistoryProviderProps) {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's chat sessions when they log in
  useEffect(() => {
    if (user) {
      refreshSessions();
    } else {
      // Clear sessions when user logs out
      setSessions([]);
      setCurrentSessionId(null);
      setCurrentMessages([]);
    }
  }, [user]);

  // Refresh the list of chat sessions
  const refreshSessions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const fetchedSessions = await getChatSessions(user.id);
      setSessions(fetchedSessions);
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create a new chat session
  const createNewChat = useCallback(async () => {
    if (!user) {
      // For guest users, just clear the current session
      setCurrentSessionId(null);
      setCurrentMessages([]);
      return;
    }

    setIsLoading(true);
    try {
      const newSession = await createChatSession(user.id);
      if (newSession) {
        setCurrentSessionId(newSession.id);
        setCurrentMessages([]);
        await refreshSessions();
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshSessions]);

  // Load an existing chat session
  const loadChat = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const messages = await getChatMessages(sessionId);
      setCurrentSessionId(sessionId);
      setCurrentMessages(messages);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a message to the current session
  const saveMessage = useCallback(
    async (message: CreateMessageInput) => {
      if (!user || !currentSessionId) return;

      try {
        const savedMessage = await saveChatMessage(currentSessionId, message);
        if (savedMessage) {
          setCurrentMessages((prev) => [...prev, savedMessage]);

          // Auto-generate title from first user message
          // Check if this is the first user message by querying the database
          if (message.role === "user") {
            const allMessages = await getChatMessages(currentSessionId);
            // If there's only 1 message (the one we just saved), generate title
            if (allMessages.length === 1) {
              const title = generateSessionTitle(message.content);
              await updateSessionTitle(currentSessionId, title);
              await refreshSessions();
            }
          }
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }
    },
    [user, currentSessionId, refreshSessions]
  );

  // Delete a chat session
  const deleteChat = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      try {
        const success = await deleteSession(sessionId);
        if (success) {
          // If we deleted the current session, clear it
          if (sessionId === currentSessionId) {
            setCurrentSessionId(null);
            setCurrentMessages([]);
          }
          await refreshSessions();
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentSessionId, refreshSessions]
  );

  // Update a session's title
  const updateTitle = useCallback(
    async (sessionId: string, title: string) => {
      try {
        const success = await updateSessionTitle(sessionId, title);
        if (success) {
          await refreshSessions();
        }
      } catch (error) {
        console.error("Error updating title:", error);
      }
    },
    [refreshSessions]
  );

  // Toggle pin status of a session
  const togglePin = useCallback(
    async (sessionId: string) => {
      try {
        const success = await togglePinSession(sessionId);
        if (success) {
          await refreshSessions();
        }
      } catch (error) {
        console.error("Error toggling pin:", error);
      }
    },
    [refreshSessions]
  );

  const value: ChatHistoryContextType = {
    currentSessionId,
    sessions,
    currentMessages,
    isLoading,
    createNewChat,
    loadChat,
    saveMessage,
    refreshSessions,
    deleteChat,
    updateTitle,
    togglePin,
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
}
