package com.agentplatform.backend.agents.dto;

public class AgentExecutionRequest {
    private String input;
    private Long reasonId;

    public AgentExecutionRequest() {}

    public AgentExecutionRequest(String input, Long reasonId) {
        this.input = input;
        this.reasonId = reasonId;
    }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public Long getReasonId() { return reasonId; }
    public void setReasonId(Long reasonId) { this.reasonId = reasonId; }
}
