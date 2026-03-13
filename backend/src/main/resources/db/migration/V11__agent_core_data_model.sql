-- V11: Agent Core Data Model - Capabilities, Permissions, Policies, and Relationships

-- Add template_id and enhanced fields to agents table
ALTER TABLE agents
ADD COLUMN template_id BIGINT AFTER description,
ADD COLUMN model_preference VARCHAR(255),
ADD COLUMN instructions TEXT,
ADD COLUMN system_prompt TEXT,
ADD CONSTRAINT fk_agents_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL;

-- Create agent_capabilities table
CREATE TABLE IF NOT EXISTS agent_capabilities (
  id BIGINT NOT NULL AUTO_INCREMENT,
  agent_id BIGINT NOT NULL,
  capability_name VARCHAR(255) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_agent_capabilities_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE KEY unique_agent_capability (agent_id, capability_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_agent_capabilities_agent ON agent_capabilities(agent_id);

-- Create agent_tool_permissions table
CREATE TABLE IF NOT EXISTS agent_tool_permissions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  agent_id BIGINT NOT NULL,
  tool_name VARCHAR(255) NOT NULL,
  permission_level VARCHAR(50) DEFAULT 'execute',
  requires_approval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_agent_tool_permissions_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE KEY unique_agent_tool (agent_id, tool_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_agent_tool_permissions_agent ON agent_tool_permissions(agent_id);

-- Create agent_policies table
CREATE TABLE IF NOT EXISTS agent_policies (
  id BIGINT NOT NULL AUTO_INCREMENT,
  agent_id BIGINT NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  policy_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_agent_policies_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE KEY unique_agent_policy (agent_id, policy_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_agent_policies_agent ON agent_policies(agent_id);

-- Create agent_relationships table for multi-agent graphs
CREATE TABLE IF NOT EXISTS agent_relationships (
  id BIGINT NOT NULL AUTO_INCREMENT,
  primary_agent_id BIGINT NOT NULL,
  related_agent_id BIGINT NOT NULL,
  relationship_type VARCHAR(50) NOT NULL DEFAULT 'collaborator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_agent_relationships_primary FOREIGN KEY (primary_agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  CONSTRAINT fk_agent_relationships_related FOREIGN KEY (related_agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE KEY unique_relationship (primary_agent_id, related_agent_id, relationship_type),
  INDEX idx_agent_relationships_primary (primary_agent_id),
  INDEX idx_agent_relationships_related (related_agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed some common capabilities
INSERT IGNORE INTO agent_capabilities (agent_id, capability_name, description, enabled) 
SELECT id, 'search', 'Ability to search information', 1 FROM agents WHERE id IN (SELECT id FROM agents LIMIT 1);

INSERT IGNORE INTO agent_capabilities (agent_id, capability_name, description, enabled) 
SELECT id, 'analysis', 'Ability to analyze data', 1 FROM agents WHERE id IN (SELECT id FROM agents LIMIT 1);

-- Seed tool permissions for common tools
INSERT IGNORE INTO agent_tool_permissions (agent_id, tool_name, permission_level, requires_approval) 
SELECT id, 'email', 'draft', 1 FROM agents WHERE id IN (SELECT id FROM agents LIMIT 1);

INSERT IGNORE INTO agent_tool_permissions (agent_id, tool_name, permission_level, requires_approval) 
SELECT id, 'calendar', 'read', 0 FROM agents WHERE id IN (SELECT id FROM agents LIMIT 1);
