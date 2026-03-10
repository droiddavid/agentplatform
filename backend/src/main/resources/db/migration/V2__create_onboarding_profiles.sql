-- Flyway migration: create onboarding_profiles table
CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  primary_goal_category VARCHAR(255),
  use_case_examples TEXT,
  privacy_preference VARCHAR(100),
  memory_preference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_onboarding_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
