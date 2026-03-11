package com.agentplatform.backend.tasks;

import java.time.Instant;

public class TaskRequest {
    private String title;
    private String description;
    private String category;
    private String status;
    private String priority;
    private Instant dueAt;

    public TaskRequest() {}

    public TaskRequest(String title, String category) {
        this.title = title;
        this.category = category;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Instant getDueAt() { return dueAt; }
    public void setDueAt(Instant dueAt) { this.dueAt = dueAt; }
}
