-- Create agent_messages table for agent-to-agent and system communications
CREATE TABLE agent_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  run_id BIGINT NOT NULL,
  sender_agent_id BIGINT,
  recipient_agent_id BIGINT,
  message_type VARCHAR(50) DEFAULT 'standard',
  subject VARCHAR(255),
  content TEXT NOT NULL,
  metadata JSON,
  status VARCHAR(50) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_agent_id) REFERENCES agents(id) ON DELETE SET NULL,
  FOREIGN KEY (recipient_agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- Create indexes for query performance
CREATE INDEX idx_messages_run ON agent_messages(run_id);
CREATE INDEX idx_messages_sender ON agent_messages(sender_agent_id);
CREATE INDEX idx_messages_recipient ON agent_messages(recipient_agent_id);
CREATE INDEX idx_messages_status ON agent_messages(status);
CREATE INDEX idx_messages_created ON agent_messages(created_at);
