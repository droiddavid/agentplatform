package com.agentplatform.backend.agents.dto;

import java.util.List;
import java.util.Map;

public class ProposedAgent {
    private String name;
    private String role;
    private String description;
    private String personaStyle;
    private String goal;
    private String goalCategory;
    private List<String> capabilities;
    private List<String> allowedTools;
    private String approvalPolicy; // "auto", "every_action", "remember"
    private Boolean workAlone; // collaboration setting
    private Boolean enableMemory;
    private String memoryType; // "short_term", "long_term", "hybrid"
    private String modelPreference;
    private Map<String, Object> additionalConfig; // for extensibility

    public ProposedAgent() {}

    public ProposedAgent(String name, String role, String description) {
        this.name = name;
        this.role = role;
        this.description = description;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPersonaStyle() { return personaStyle; }
    public void setPersonaStyle(String personaStyle) { this.personaStyle = personaStyle; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public String getGoalCategory() { return goalCategory; }
    public void setGoalCategory(String goalCategory) { this.goalCategory = goalCategory; }

    public List<String> getCapabilities() { return capabilities; }
    public void setCapabilities(List<String> capabilities) { this.capabilities = capabilities; }

    public List<String> getAllowedTools() { return allowedTools; }
    public void setAllowedTools(List<String> allowedTools) { this.allowedTools = allowedTools; }

    public String getApprovalPolicy() { return approvalPolicy; }
    public void setApprovalPolicy(String approvalPolicy) { this.approvalPolicy = approvalPolicy; }

    public Boolean getWorkAlone() { return workAlone; }
    public void setWorkAlone(Boolean workAlone) { this.workAlone = workAlone; }

    public Boolean getEnableMemory() { return enableMemory; }
    public void setEnableMemory(Boolean enableMemory) { this.enableMemory = enableMemory; }

    public String getMemoryType() { return memoryType; }
    public void setMemoryType(String memoryType) { this.memoryType = memoryType; }

    public String getModelPreference() { return modelPreference; }
    public void setModelPreference(String modelPreference) { this.modelPreference = modelPreference; }

    public Map<String, Object> getAdditionalConfig() { return additionalConfig; }
    public void setAdditionalConfig(Map<String, Object> additionalConfig) { this.additionalConfig = additionalConfig; }
}
