-- Migration: Add pinned column to chat_sessions table
-- Run this in your Supabase SQL Editor

-- Add pinned column with default value false
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false NOT NULL;

-- Create index for better query performance when sorting by pinned status
CREATE INDEX IF NOT EXISTS idx_chat_sessions_pinned ON chat_sessions(pinned DESC, updated_at DESC);

-- Optional: Update existing sessions to be unpinned (already default, but explicit)
UPDATE chat_sessions SET pinned = false WHERE pinned IS NULL;
