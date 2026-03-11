package com.agentplatform.backend.runs;

import java.time.Instant;

public class RunResponse {
    private Long id;
    private Long taskId;
    private Long agentId;
    private Long ownerId;
    private String status;
    private String input;
    private String output;
    private String logs;
    private String errorMessage;
    private Instant startedAt;
    private Instant completedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public RunResponse() {}

    public RunResponse(Run run) {
        this.id = run.getId();
        this.taskId = run.getTaskId();
        this.agentId = run.getAgentId();
        this.ownerId = run.getOwnerId();
        this.status = run.getStatus();
        this.input = run.getInput();
        this.output = run.getOutput();
        this.logs = run.getLogs();
        this.errorMessage = run.getErrorMessage();
        this.startedAt = run.getStartedAt();
        this.completedAt = run.getCompletedAt();
        this.createdAt = run.getCreatedAt();
        this.updatedAt = run.getUpdatedAt();
    }

    public Long getId() { return id; }

    public Long getTaskId() { return taskId; }

    public Long getAgentId() { return agentId; }

    public Long getOwnerId() { return ownerId; }

    public String getStatus() { return status; }

    public String getInput() { return input; }

    public String getOutput() { return output; }

    public String getLogs() { return logs; }

    public String getErrorMessage() { return errorMessage; }

    public Instant getStartedAt() { return startedAt; }

    public Instant getCompletedAt() { return completedAt; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
}
