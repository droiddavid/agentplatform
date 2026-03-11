package com.agentplatform.backend.agents.dto;

import java.time.Instant;

public class AgentExecutionResponse {
    private Long id;
    private Long agentId;
    private String sessionId;
    private String status;
    private String input;
    private String output;
    private String errorMessage;
    private Instant createdAt;
    private Instant startedAt;
    private Instant completedAt;
    private Long reasonId;

    public AgentExecutionResponse() {}

    public AgentExecutionResponse(Long id, Long agentId, String sessionId, String status,
                                  String input, String output, String errorMessage,
                                  Instant createdAt, Instant startedAt, Instant completedAt,
                                  Long reasonId) {
        this.id = id;
        this.agentId = agentId;
        this.sessionId = sessionId;
        this.status = status;
        this.input = input;
        this.output = output;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.reasonId = reasonId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Long getReasonId() { return reasonId; }
    public void setReasonId(Long reasonId) { this.reasonId = reasonId; }
}
