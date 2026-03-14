package com.agentplatform.backend.agents.dto;

import java.time.Instant;

public class AgentPolicyResponse {
    private Long id;
    private String policyName;
    private String policyValue;
    private Instant createdAt;

    public AgentPolicyResponse() {}

    public AgentPolicyResponse(Long id, String policyName, String policyValue, Instant createdAt) {
        this.id = id;
        this.policyName = policyName;
        this.policyValue = policyValue;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getPolicyName() { return policyName; }
    public String getPolicyValue() { return policyValue; }
    public Instant getCreatedAt() { return createdAt; }
}
