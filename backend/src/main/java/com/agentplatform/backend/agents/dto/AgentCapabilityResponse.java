package com.agentplatform.backend.agents.dto;

import java.time.Instant;

public class AgentCapabilityResponse {
    private Long id;
    private String capabilityName;
    private String description;
    private Boolean enabled;
    private Instant createdAt;

    public AgentCapabilityResponse() {}

    public AgentCapabilityResponse(Long id, String capabilityName, String description, Boolean enabled, Instant createdAt) {
        this.id = id;
        this.capabilityName = capabilityName;
        this.description = description;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getCapabilityName() { return capabilityName; }
    public String getDescription() { return description; }
    public Boolean getEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
}
