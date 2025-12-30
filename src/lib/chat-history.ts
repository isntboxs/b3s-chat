import { supabase } from "./supabase";

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  created_at: string;
}

export interface CreateMessageInput {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
}

/**
 * Create a new chat session
 */
export async function createChatSession(
  userId: string,
  title: string = "New Chat"
): Promise<ChatSession | null> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        title,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat session:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error creating chat session:", error);
    return null;
  }
}

/**
 * Get all chat sessions for a user, ordered by pinned first, then most recent
 */
export async function getChatSessions(
  userId: string
): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching chat sessions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return [];
  }
}

/**
 * Get a single chat session by ID
 */
export async function getChatSession(
  sessionId: string
): Promise<ChatSession | null> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) {
      console.error("Error fetching chat session:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching chat session:", error);
    return null;
  }
}

/**
 * Get all messages for a chat session
 */
export async function getChatMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
}

/**
 * Save a message to a chat session
 */
export async function saveChatMessage(
  sessionId: string,
  message: CreateMessageInput
): Promise<ChatMessage | null> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role: message.role,
        content: message.content,
        thinking: message.thinking,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving chat message:", error);
      return null;
    }

    // Update the session's updated_at timestamp
    await supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    return data;
  } catch (error) {
    console.error("Error saving chat message:", error);
    return null;
  }
}

/**
 * Update a chat session's title
 */
export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ title })
      .eq("id", sessionId);

    if (error) {
      console.error("Error updating session title:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating session title:", error);
    return false;
  }
}

/**
 * Delete a chat session (and all its messages via CASCADE)
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      console.error("Error deleting session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

/**
 * Generate a title from the first user message
 */
export function generateSessionTitle(firstMessage: string): string {
  // Take first 50 characters and add ellipsis if needed
  const maxLength = 50;
  if (firstMessage.length <= maxLength) {
    return firstMessage;
  }
  return firstMessage.substring(0, maxLength).trim() + "...";
}

/**
 * Toggle pin status of a chat session
 */
export async function togglePinSession(
  sessionId: string
): Promise<boolean> {
  try {
    // First get the current pinned status
    const { data: session, error: fetchError } = await supabase
      .from("chat_sessions")
      .select("pinned")
      .eq("id", sessionId)
      .single();

    if (fetchError) {
      console.error("Error fetching session:", fetchError);
      return false;
    }

    // Toggle the pinned status
    const { error: updateError } = await supabase
      .from("chat_sessions")
      .update({ pinned: !session.pinned })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Error toggling pin status:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error toggling pin status:", error);
    return false;
  }
}
