ALTER TABLE tool_owners
  ADD COLUMN IF NOT EXISTS tool_description varchar(100);