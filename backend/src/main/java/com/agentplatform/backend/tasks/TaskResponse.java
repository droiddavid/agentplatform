package com.agentplatform.backend.tasks;

import java.time.Instant;

public class TaskResponse {
    private Long id;
    private Long ownerId;
    private String title;
    private String description;
    private String category;
    private String status;
    private String priority;
    private Instant dueAt;
    private Long currentRunId;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean archived;

    public TaskResponse() {}

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.ownerId = task.getOwnerId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.category = task.getCategory();
        this.status = task.getStatus();
        this.priority = task.getPriority();
        this.dueAt = task.getDueAt();
        this.currentRunId = task.getCurrentRunId();
        this.createdAt = task.getCreatedAt();
        this.updatedAt = task.getUpdatedAt();
        this.archived = task.getArchived();
    }

    public Long getId() { return id; }

    public Long getOwnerId() { return ownerId; }

    public String getTitle() { return title; }

    public String getDescription() { return description; }

    public String getCategory() { return category; }

    public String getStatus() { return status; }

    public String getPriority() { return priority; }

    public Instant getDueAt() { return dueAt; }

    public Long getCurrentRunId() { return currentRunId; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }

    public Boolean getArchived() { return archived; }
}
