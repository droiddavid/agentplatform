package com.agentplatform.backend.agents.dto;

public class AgentParseRequest {
    private String description;
    private String userContext; // optional: additional context about user preferences

    public AgentParseRequest() {}

    public AgentParseRequest(String description) {
        this.description = description;
    }

    public AgentParseRequest(String description, String userContext) {
        this.description = description;
        this.userContext = userContext;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserContext() { return userContext; }
    public void setUserContext(String userContext) { this.userContext = userContext; }
}
