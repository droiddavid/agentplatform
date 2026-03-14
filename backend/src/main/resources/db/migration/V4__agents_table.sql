-- Enhance agents table: add owner_id (migration from user_id) and audit fields
-- Step 1: Add owner_id column
ALTER TABLE agents ADD COLUMN owner_id BIGINT;

-- Step 2: Populate owner_id from user_id
UPDATE agents SET owner_id = user_id WHERE owner_id IS NULL AND user_id IS NOT NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE agents MODIFY COLUMN owner_id BIGINT NOT NULL;

-- Step 4: Add status and visibility
ALTER TABLE agents ADD COLUMN status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE agents ADD COLUMN visibility VARCHAR(50) DEFAULT 'private';

-- Step 5: Add updated_at
ALTER TABLE agents ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Step 6: Create indexes
CREATE INDEX idx_agents_owner ON agents(owner_id);
