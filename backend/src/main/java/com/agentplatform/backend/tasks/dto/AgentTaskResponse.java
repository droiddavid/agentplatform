package com.agentplatform.backend.tasks.dto;

import java.time.Instant;

public class AgentTaskResponse {
    private Long id;
    private Long agentId;
    private Long taskId;
    private Instant assignedAt;
    private Long assignedBy;

    public AgentTaskResponse() {}

    public AgentTaskResponse(Long id, Long agentId, Long taskId, Instant assignedAt, Long assignedBy) {
        this.id = id;
        this.agentId = agentId;
        this.taskId = taskId;
        this.assignedAt = assignedAt;
        this.assignedBy = assignedBy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }

    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }
}
