package com.agentplatform.backend.onboarding;

import com.agentplatform.backend.onboarding.dto.OnboardingRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OnboardingService {

    private final OnboardingProfileRepository repository;

    public OnboardingService(OnboardingProfileRepository repository) {
        this.repository = repository;
    }

    public OnboardingProfile createOrUpdate(OnboardingRequest req) {
        Optional<OnboardingProfile> existing = repository.findByUserId(req.getUserId());
        OnboardingProfile p = existing.orElseGet(OnboardingProfile::new);
        p.setUserId(req.getUserId());
        p.setPrimaryGoalCategory(req.getPrimaryGoalCategory());
        p.setUseCaseExamples(req.getUseCaseExamples());
        p.setPrivacyPreference(req.getPrivacyPreference());
        p.setMemoryPreference(req.getMemoryPreference());
        return repository.save(p);
    }

    public Optional<OnboardingProfile> findByUserId(Long userId) {
        return repository.findByUserId(userId);
    }
}
