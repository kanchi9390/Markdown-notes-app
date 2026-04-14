-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);

-- Create full-text search index
CREATE FULLTEXT INDEX idx_notes_fulltext ON notes(title, content);
