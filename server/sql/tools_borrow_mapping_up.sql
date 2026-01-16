CREATE TABLE IF NOT EXISTS tools_borrow_mapping (
    borrow_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrower_uuid UUID NOT NULL,
    lender_uuid UUID NOT NULL,
    tool_uuid UUID NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lender
        FOREIGN KEY (lender_uuid)
        REFERENCES users(user_uuid),
    CONSTRAINT fk_borrower
        FOREIGN KEY (borrower_uuid)
        REFERENCES users(user_uuid),
    CONSTRAINT fk_tool
        FOREIGN KEY (tool_uuid)
        REFERENCES tools(tool_uuid)
);