package com.agentplatform.backend.tasks;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // work, personal, creative, research, household, etc.

    @Column(nullable = false)
    private String status = "draft"; // draft, ready, running, waiting_approval, completed, failed, cancelled

    @Column
    private String priority = "medium"; // low, medium, high, urgent

    @Column(name = "due_at")
    private Instant dueAt;

    @Column(name = "current_run_id")
    private Long currentRunId; // Reference to active run if any

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @Column(name = "archived")
    private Boolean archived = false;

    public Task() {}

    public Task(Long ownerId, String title, String category) {
        this.ownerId = ownerId;
        this.title = title;
        this.category = category;
    }

    public Long getId() { return id; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

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

    public Long getCurrentRunId() { return currentRunId; }
    public void setCurrentRunId(Long currentRunId) { this.currentRunId = currentRunId; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getArchived() { return archived; }
    public void setArchived(Boolean archived) { this.archived = archived; }
}
