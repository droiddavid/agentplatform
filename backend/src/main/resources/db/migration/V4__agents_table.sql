-- Enhance agents table: add owner_id (migration from user_id) and audit fields
-- V1 schema created agents with user_id; Java entity uses owner_id
-- This migration adds owner_id column and indexes

-- Step 1: Add owner_id column if it doesn't exist (copy from user_id if present)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS owner_id BIGINT;

-- Step 2: If owner_id is null, populate it from user_id (handles existing data)
UPDATE agents SET owner_id = user_id WHERE owner_id IS NULL AND user_id IS NOT NULL;

-- Step 3: Add NOT NULL constraint once all rows have values
ALTER TABLE agents MODIFY COLUMN owner_id BIGINT NOT NULL;

-- Step 4: Add status and visibility if missing
ALTER TABLE agents ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'private';

-- Step 5: Add updated_at if missing
ALTER TABLE agents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Step 6: Create indexes for query performance
CREATE INDEX IF NOT EXISTS idx_agents_owner ON agents(owner_id);
