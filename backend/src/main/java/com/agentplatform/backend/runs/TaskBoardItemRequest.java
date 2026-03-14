package com.agentplatform.backend.runs;

public class TaskBoardItemRequest {
    private String runId;
    private String createdByRunAgentId;
    private String assignedToRunAgentId;
    private String title;
    private String description;
    private String status;
    private String priority = "MEDIUM";

    // Constructors
    public TaskBoardItemRequest() {
    }

    public TaskBoardItemRequest(String runId, String title, String status) {
        this.runId = runId;
        this.title = title;
        this.status = status;
    }

    // Getters and Setters
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
}
