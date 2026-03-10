package com.agentplatform.backend.onboarding;

import com.agentplatform.backend.onboarding.dto.OnboardingRequest;
import com.agentplatform.backend.onboarding.dto.OnboardingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService service;

    public OnboardingController(OnboardingService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public ResponseEntity<OnboardingResponse> start(@RequestBody OnboardingRequest req) {
        var saved = service.createOrUpdate(req);
        var resp = new OnboardingResponse();
        resp.setId(saved.getId());
        resp.setUserId(saved.getUserId());
        resp.setPrimaryGoalCategory(saved.getPrimaryGoalCategory());
        resp.setUseCaseExamples(saved.getUseCaseExamples());
        resp.setPrivacyPreference(saved.getPrivacyPreference());
        resp.setMemoryPreference(saved.getMemoryPreference());
        resp.setCreatedAt(saved.getCreatedAt());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<OnboardingResponse> get(@PathVariable Long userId) {
        return service.findByUserId(userId)
                .map(p -> {
                    var resp = new OnboardingResponse();
                    resp.setId(p.getId());
                    resp.setUserId(p.getUserId());
                    resp.setPrimaryGoalCategory(p.getPrimaryGoalCategory());
                    resp.setUseCaseExamples(p.getUseCaseExamples());
                    resp.setPrivacyPreference(p.getPrivacyPreference());
                    resp.setMemoryPreference(p.getMemoryPreference());
                    resp.setCreatedAt(p.getCreatedAt());
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
