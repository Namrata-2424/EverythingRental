CREATE TABLE IF NOT EXISTS tool_owners (
    lend_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lender_uuid UUID NOT NULL,
    tool_uuid UUID NOT NULL,
    quantity INT CHECK (quantity > 0),
    borrow_day_count INT DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lender_uuid
        FOREIGN KEY (lender_uuid)
        REFERENCES users(user_uuid)
        ON DELETE CASCADE,
    CONSTRAINT fk_tool_uuid
        FOREIGN KEY (tool_uuid)
        REFERENCES tools(tool_uuid)
        ON DELETE CASCADE
);