package com.agentplatform.backend.runs;

import java.time.Instant;

public class TaskBoardItemResponse {
    private String id;
    private String runId;
    private String createdByRunAgentId;
    private String assignedToRunAgentId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant completedAt;

    // Constructors
    public TaskBoardItemResponse() {
    }

    public TaskBoardItemResponse(TaskBoardItem item) {
        this.id = item.getId();
        this.runId = item.getRunId();
        this.createdByRunAgentId = item.getCreatedByRunAgentId();
        this.assignedToRunAgentId = item.getAssignedToRunAgentId();
        this.title = item.getTitle();
        this.description = item.getDescription();
        this.status = item.getStatus();
        this.priority = item.getPriority();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
        this.completedAt = item.getCompletedAt();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public String getCreatedByRunAgentId() {
        return createdByRunAgentId;
    }

    public void setCreatedByRunAgentId(String createdByRunAgentId) {
        this.createdByRunAgentId = createdByRunAgentId;
    }

    public String getAssignedToRunAgentId() {
        return assignedToRunAgentId;
    }

    public void setAssignedToRunAgentId(String assignedToRunAgentId) {
        this.assignedToRunAgentId = assignedToRunAgentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
