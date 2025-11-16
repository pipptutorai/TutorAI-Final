-- Migration: Add chat sessions for conversation context
-- This allows users to continue conversations with context from previous messages

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);

-- Add session_id to chat_history table
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE;

CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);

-- Create view for recent conversations
CREATE OR REPLACE VIEW recent_conversations AS
SELECT 
    cs.id as session_id,
    cs.user_id,
    cs.title,
    cs.last_message_at,
    cs.created_at,
    COUNT(ch.id) as message_count,
    (SELECT ch2.message FROM chat_history ch2 WHERE ch2.session_id = cs.id ORDER BY ch2.created_at ASC LIMIT 1) as first_message
FROM chat_sessions cs
LEFT JOIN chat_history ch ON cs.id = ch.session_id
GROUP BY cs.id, cs.user_id, cs.title, cs.last_message_at, cs.created_at
ORDER BY cs.last_message_at DESC;

COMMENT ON TABLE chat_sessions IS 'Chat sessions for maintaining conversation context';
COMMENT ON COLUMN chat_history.session_id IS 'Reference to chat session for conversation continuity';
