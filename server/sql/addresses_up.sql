CREATE TABLE IF NOT EXISTS addresses (
    address_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_uuid UUID NOT NULL,
    city VARCHAR(100),
    locality VARCHAR(150),
    pincode VARCHAR(6),
    state_name VARCHAR(50),
    country VARCHAR(50),
    CONSTRAINT fk_address_user
        FOREIGN KEY (user_uuid)
        REFERENCES users(user_uuid)
        ON DELETE CASCADE
);