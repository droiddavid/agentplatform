package com.agentplatform.backend.agents.dto;

public class AgentCreateRequest {
    private String name;
    private String description;
    private Long templateId;
    private String modelPreference;
    private String instructions;
    private String systemPrompt;

    public AgentCreateRequest() {}
    
    public AgentCreateRequest(String name, String description) { 
        this.name = name; 
        this.description = description; 
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public String getModelPreference() { return modelPreference; }
    public void setModelPreference(String modelPreference) { this.modelPreference = modelPreference; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getSystemPrompt() { return systemPrompt; }
    public void setSystemPrompt(String systemPrompt) { this.systemPrompt = systemPrompt; }
}
