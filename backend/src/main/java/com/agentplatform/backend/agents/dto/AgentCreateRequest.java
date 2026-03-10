package com.agentplatform.backend.agents.dto;

public class AgentCreateRequest {
    private String name;
    private String description;

    public AgentCreateRequest() {}
    public AgentCreateRequest(String name, String description) { this.name = name; this.description = description; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
