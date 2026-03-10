package com.agentplatform.backend.onboarding;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "onboarding_profiles")
public class OnboardingProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String primaryGoalCategory;

    @Column(columnDefinition = "TEXT")
    private String useCaseExamples;

    private String privacyPreference;

    private String memoryPreference;

    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    void onCreate() { createdAt = updatedAt = Instant.now(); }

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    public OnboardingProfile() {}

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPrimaryGoalCategory() { return primaryGoalCategory; }
    public void setPrimaryGoalCategory(String primaryGoalCategory) { this.primaryGoalCategory = primaryGoalCategory; }
    public String getUseCaseExamples() { return useCaseExamples; }
    public void setUseCaseExamples(String useCaseExamples) { this.useCaseExamples = useCaseExamples; }
    public String getPrivacyPreference() { return privacyPreference; }
    public void setPrivacyPreference(String privacyPreference) { this.privacyPreference = privacyPreference; }
    public String getMemoryPreference() { return memoryPreference; }
    public void setMemoryPreference(String memoryPreference) { this.memoryPreference = memoryPreference; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
