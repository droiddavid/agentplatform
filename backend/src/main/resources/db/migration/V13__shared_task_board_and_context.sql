-- V13: Create shared_task_board_items and shared_context_entries tables
-- Purpose: Enable agents to share tasks and context data within a run

-- Create shared_task_board_items table
CREATE TABLE shared_task_board_items (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    run_id VARCHAR(26) NOT NULL,
    created_by_run_agent_id VARCHAR(26),
    assigned_to_run_agent_id VARCHAR(26),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    completed_at DATETIME,
    
    FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_run_agent_id) REFERENCES run_agents(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_run_agent_id) REFERENCES run_agents(id) ON DELETE SET NULL
);

-- Create indexes for shared_task_board_items
CREATE INDEX idx_board_items_run_id ON shared_task_board_items(run_id);
CREATE INDEX idx_board_items_created_by ON shared_task_board_items(created_by_run_agent_id);
CREATE INDEX idx_board_items_assigned_to ON shared_task_board_items(assigned_to_run_agent_id);
CREATE INDEX idx_board_items_status ON shared_task_board_items(status);
CREATE INDEX idx_board_items_created_at ON shared_task_board_items(created_at);

-- Create shared_context_entries table
CREATE TABLE shared_context_entries (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    run_id VARCHAR(26) NOT NULL,
    created_by_run_agent_id VARCHAR(26),
    context_key VARCHAR(120) NOT NULL,
    context_value_json JSON NOT NULL,
    visibility_scope VARCHAR(32) NOT NULL DEFAULT 'SHARED',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    
    FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_run_agent_id) REFERENCES run_agents(id) ON DELETE SET NULL
);

-- Create indexes for shared_context_entries
CREATE INDEX idx_context_entries_run_id ON shared_context_entries(run_id);
CREATE INDEX idx_context_entries_created_by ON shared_context_entries(created_by_run_agent_id);
CREATE INDEX idx_context_entries_key ON shared_context_entries(context_key);
CREATE INDEX idx_context_entries_visibility ON shared_context_entries(visibility_scope);
CREATE INDEX idx_context_entries_created_at ON shared_context_entries(created_at);
