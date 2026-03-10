package com.agentplatform.backend.onboarding.dto;

public class OnboardingRequest {
    private Long userId;
    private String primaryGoalCategory;
    private String useCaseExamples;
    private String privacyPreference;
    private String memoryPreference;

    public OnboardingRequest() {}

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
}
