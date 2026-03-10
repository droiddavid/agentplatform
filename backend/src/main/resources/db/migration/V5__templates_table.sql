-- V5: templates table and seed data
CREATE TABLE IF NOT EXISTS templates (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content JSON NULL,
  category VARCHAR(128) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- seed a couple of starter templates
INSERT INTO templates (name, description, content, category) VALUES
('Personal Assistant','Basic personal assistant template', JSON_OBJECT('prompt','You are a helpful personal assistant.'),'starter'),
('Researcher','Multi-agent researcher template', JSON_OBJECT('prompt','You are a researcher that gathers sources and summarizes.'),'starter');
