package com.agentplatform.backend.agents.dto;

import java.util.List;

public class AgentCreateRequest {
    // Basic info
    private String name;
    private String description;
    
    // Template & Model
    private Long templateId;
    private String modelPreference; // 'fast' | 'balanced' | 'accurate'
    private String instructions;
    private String systemPrompt;
    
    // Wizard fields
    private String goal;
    private String goalCategory; // 'life' | 'work' | 'business' | 'family' | 'content'
    private String role;
    private List<String> capabilities;
    private List<String> allowedTools;
    private Boolean workAlone;
    private List<String> collaboration;
    private Boolean approveEveryAction;
    private Boolean rememberApprovals;
    private Boolean enableMemory;
    private String memoryType; // 'short-term' | 'long-term' | 'both'

    public AgentCreateRequest() {}
    
    public AgentCreateRequest(String name, String description) { 
        this.name = name; 
        this.description = description; 
    }

    // Getters & Setters
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
    
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    
    public String getGoalCategory() { return goalCategory; }
    public void setGoalCategory(String goalCategory) { this.goalCategory = goalCategory; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public List<String> getCapabilities() { return capabilities; }
    public void setCapabilities(List<String> capabilities) { this.capabilities = capabilities; }
    
    public List<String> getAllowedTools() { return allowedTools; }
    public void setAllowedTools(List<String> allowedTools) { this.allowedTools = allowedTools; }
    
    public Boolean getWorkAlone() { return workAlone; }
    public void setWorkAlone(Boolean workAlone) { this.workAlone = workAlone; }
    
    public List<String> getCollaboration() { return collaboration; }
    public void setCollaboration(List<String> collaboration) { this.collaboration = collaboration; }
    
    public Boolean getApproveEveryAction() { return approveEveryAction; }
    public void setApproveEveryAction(Boolean approveEveryAction) { this.approveEveryAction = approveEveryAction; }
    
    public Boolean getRememberApprovals() { return rememberApprovals; }
    public void setRememberApprovals(Boolean rememberApprovals) { this.rememberApprovals = rememberApprovals; }
    
    public Boolean getEnableMemory() { return enableMemory; }
    public void setEnableMemory(Boolean enableMemory) { this.enableMemory = enableMemory; }
    
    public String getMemoryType() { return memoryType; }
    public void setMemoryType(String memoryType) { this.memoryType = memoryType; }
}
