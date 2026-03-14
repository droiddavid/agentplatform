package com.agentplatform.backend.runs;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "shared_task_board_items")
public class TaskBoardItem {
    @Id
    @Column(length = 26)
    private String id;

    @Column(name = "run_id", length = 26, nullable = false)
    private String runId;

    @Column(name = "created_by_run_agent_id", length = 26)
    private String createdByRunAgentId;

    @Column(name = "assigned_to_run_agent_id", length = 26)
    private String assignedToRunAgentId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String priority = "MEDIUM";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    // Constructors
    public TaskBoardItem() {
    }

    public TaskBoardItem(String id, String runId, String title, String status) {
        this.id = id;
        this.runId = runId;
        this.title = title;
        this.status = status;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public TaskBoardItem(String id, String runId, String createdByRunAgentId, String title, String description, String status, String priority) {
        this.id = id;
        this.runId = runId;
        this.createdByRunAgentId = createdByRunAgentId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
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
