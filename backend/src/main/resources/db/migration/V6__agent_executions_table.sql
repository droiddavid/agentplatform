-- V6: agent_executions table for tracking agent execution sessions
CREATE TABLE IF NOT EXISTS agent_executions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  agent_id BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  input LONGTEXT,
  output LONGTEXT,
  error_message LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  reason_id BIGINT NULL,
  PRIMARY KEY (id),
  KEY idx_agent_owner (agent_id, owner_id),
  KEY idx_owner (owner_id),
  KEY idx_session (session_id),
  KEY idx_status (status),
  CONSTRAINT fk_agent_exec_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  CONSTRAINT fk_agent_exec_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
