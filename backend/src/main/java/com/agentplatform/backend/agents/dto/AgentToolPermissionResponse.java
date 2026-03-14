package com.agentplatform.backend.agents.dto;

import java.time.Instant;

public class AgentToolPermissionResponse {
    private Long id;
    private String toolName;
    private String permissionLevel;
    private Boolean requiresApproval;
    private Instant createdAt;

    public AgentToolPermissionResponse() {}

    public AgentToolPermissionResponse(Long id, String toolName, String permissionLevel, Boolean requiresApproval, Instant createdAt) {
        this.id = id;
        this.toolName = toolName;
        this.permissionLevel = permissionLevel;
        this.requiresApproval = requiresApproval;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getToolName() { return toolName; }
    public String getPermissionLevel() { return permissionLevel; }
    public Boolean getRequiresApproval() { return requiresApproval; }
    public Instant getCreatedAt() { return createdAt; }
}
