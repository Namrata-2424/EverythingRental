CREATE TABLE IF NOT EXISTS tools (
    tool_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL,
    category category_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);