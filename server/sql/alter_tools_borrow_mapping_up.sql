ALTER TABLE tools_borrow_mapping 
  ADD COLUMN return_status VARCHAR(20) NOT NULL DEFAULT 'Borrowed';