package com.agentplatform.backend.agents.dto;

import java.time.Instant;

public class AgentResponse {
    private Long id;
    private Long ownerId;
    private String name;
    private String description;
    private String status;
    private String visibility;
    private Instant createdAt;

    public AgentResponse() {}

    public AgentResponse(Long id, Long ownerId, String name, String description, String status, String visibility, Instant createdAt) {
        this.id = id; this.ownerId = ownerId; this.name = name; this.description = description; this.status = status; this.visibility = visibility; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getOwnerId() { return ownerId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getVisibility() { return visibility; }
    public Instant getCreatedAt() { return createdAt; }
}
