package com.agentplatform.backend.agents.dto;

import java.time.Instant;
import java.util.List;

public class AgentResponse {
    private Long id;
    private Long ownerId;
    private Long templateId;
    private String name;
    private String description;
    private String status;
    private String visibility;
    private String modelPreference;
    private String instructions;
    private String systemPrompt;
    private List<AgentCapabilityResponse> capabilities;
    private List<AgentToolPermissionResponse> toolPermissions;
    private List<AgentPolicyResponse> policies;
    private Instant createdAt;
    private Instant updatedAt;

    public AgentResponse() {}

    public AgentResponse(Long id, Long ownerId, String name, String description, String status, String visibility, Instant createdAt) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.status = status;
        this.visibility = visibility;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getOwnerId() { return ownerId; }
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getVisibility() { return visibility; }
    public String getModelPreference() { return modelPreference; }
    public void setModelPreference(String modelPreference) { this.modelPreference = modelPreference; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getSystemPrompt() { return systemPrompt; }
    public void setSystemPrompt(String systemPrompt) { this.systemPrompt = systemPrompt; }
    public List<AgentCapabilityResponse> getCapabilities() { return capabilities; }
    public void setCapabilities(List<AgentCapabilityResponse> capabilities) { this.capabilities = capabilities; }
    public List<AgentToolPermissionResponse> getToolPermissions() { return toolPermissions; }
    public void setToolPermissions(List<AgentToolPermissionResponse> toolPermissions) { this.toolPermissions = toolPermissions; }
    public List<AgentPolicyResponse> getPolicies() { return policies; }
    public void setPolicies(List<AgentPolicyResponse> policies) { this.policies = policies; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
