-- V10: Template Catalog System - Categories and Seeds

-- Create template_categories table
CREATE TABLE IF NOT EXISTS template_categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add category_id FK to templates table
ALTER TABLE templates
ADD COLUMN category_id BIGINT AFTER category;

ALTER TABLE templates
ADD CONSTRAINT fk_templates_category
FOREIGN KEY (category_id) REFERENCES template_categories(id);

-- Seed template categories
INSERT INTO template_categories (name, description, icon, display_order) VALUES
('Business', 'Templates for business automation and productivity', '💼', 1),
('Household', 'Templates for personal and home management', '🏠', 2),
('Creator', 'Templates for content creation and marketing', '🎨', 3),
('Planning', 'Templates for project and event planning', '📅', 4),
('Research', 'Templates for research and data analysis', '🔬', 5);

-- Seed Business templates
INSERT INTO templates (name, description, content, category_id, created_at) VALUES
('Sales Assistant', 'AI assistant to help with sales pipelines, lead qualification, and deal forecasting', JSON_OBJECT('prompt', 'You are a sales assistant helping manage pipelines and qualify leads.', 'capabilities', JSON_ARRAY('lead_qualification', 'pipeline_analysis', 'forecasting')), 1, CURRENT_TIMESTAMP),
('Customer Support Bot', 'Intelligent customer support agent that handles inquiries and escalations', JSON_OBJECT('prompt', 'You are a customer support agent providing helpful, empathetic responses.', 'capabilities', JSON_ARRAY('ticket_triage', 'faq_response', 'escalation')), 1, CURRENT_TIMESTAMP),
('HR Recruiter', 'Automated recruiter to screen resumes and manage hiring workflows', JSON_OBJECT('prompt', 'You are an HR recruiter screening candidates and scheduling interviews.', 'capabilities', JSON_ARRAY('resume_screening', 'candidate_ranking', 'scheduling')), 1, CURRENT_TIMESTAMP);

-- Seed Household templates
INSERT INTO templates (name, description, content, category_id, created_at) VALUES
('Budget Assistant', 'Personal finance assistant for budgeting and expense tracking', JSON_OBJECT('prompt', 'You are a personal finance assistant helping manage budgets and expenses.', 'capabilities', JSON_ARRAY('expense_categorization', 'budget_analysis', 'recommendations')), 2, CURRENT_TIMESTAMP),
('Home Maintenance Tracker', 'Assistant to track maintenance schedules and home improvement tasks', JSON_OBJECT('prompt', 'You are a home maintenance coordinator tracking schedules and tasks.', 'capabilities', JSON_ARRAY('maintenance_scheduling', 'vendor_management', 'reminders')), 2, CURRENT_TIMESTAMP),
('Meal Planner', 'AI meal planner that creates weekly menus and generates shopping lists', JSON_OBJECT('prompt', 'You are a meal planning assistant creating menus and shopping lists.', 'capabilities', JSON_ARRAY('menu_planning', 'recipe_suggestions', 'shopping_lists')), 2, CURRENT_TIMESTAMP);

-- Seed Creator templates  
INSERT INTO templates (name, description, content, category_id, created_at) VALUES
('Content Ideas Assistant', 'Generate creative content ideas across multiple platforms and formats', JSON_OBJECT('prompt', 'You are a creative content strategist generating ideas for blogs, videos, and social media.', 'capabilities', JSON_ARRAY('idea_generation', 'platform_optimization', 'trend_analysis')), 3, CURRENT_TIMESTAMP),
('Social Media Planner', 'Plan and schedule social media content with analytics and optimization', JSON_OBJECT('prompt', 'You are a social media strategist planning and optimizing content calendars.', 'capabilities', JSON_ARRAY('calendar_planning', 'content_optimization', 'analytics')), 3, CURRENT_TIMESTAMP),
('Email Campaign Manager', 'Create and optimize email marketing campaigns with A/B testing support', JSON_OBJECT('prompt', 'You are an email marketing specialist creating and testing campaigns.', 'capabilities', JSON_ARRAY('campaign_creation', 'ab_testing', 'performance_analysis')), 3, CURRENT_TIMESTAMP);

-- Seed Planning templates
INSERT INTO templates (name, description, content, category_id, created_at) VALUES
('Project Manager', 'Manage projects with timelines, dependencies, and team coordination', JSON_OBJECT('prompt', 'You are a project manager overseeing timelines, resources, and deliverables.', 'capabilities', JSON_ARRAY('timeline_planning', 'risk_management', 'team_coordination')), 4, CURRENT_TIMESTAMP),
('Event Organizer', 'Plan and coordinate events with schedules, vendors, and logistics', JSON_OBJECT('prompt', 'You are an event coordinator managing all aspects of event planning.', 'capabilities', JSON_ARRAY('vendor_coordination', 'timeline_management', 'logistics')), 4, CURRENT_TIMESTAMP),
('Goal Achievement Partner', 'Help set, track, and achieve personal and professional goals', JSON_OBJECT('prompt', 'You are a goal achievement coach helping set and track progress.', 'capabilities', JSON_ARRAY('goal_setting', 'progress_tracking', 'motivation')), 4, CURRENT_TIMESTAMP);

-- Seed Research templates
INSERT INTO templates (name, description, content, category_id, created_at) VALUES
('Literature Researcher', 'Conduct literature reviews and summarize research across multiple sources', JSON_OBJECT('prompt', 'You are a research assistant conducting literature reviews and synthesis.', 'capabilities', JSON_ARRAY('source_analysis', 'synthesis', 'bibliography_management')), 5, CURRENT_TIMESTAMP),
('Data Analyst', 'Analyze datasets, create visualizations, and derive insights', JSON_OBJECT('prompt', 'You are a data analyst identifying patterns and creating insights from data.', 'capabilities', JSON_ARRAY('data_analysis', 'visualization', 'statistical_testing')), 5, CURRENT_TIMESTAMP),
('Competitive Intelligence Agent', 'Monitor and analyze competitors, market trends, and industry insights', JSON_OBJECT('prompt', 'You are a competitive intelligence analyst tracking market trends and competitors.', 'capabilities', JSON_ARRAY('competitor_monitoring', 'trend_analysis', 'market_research')), 5, CURRENT_TIMESTAMP);
