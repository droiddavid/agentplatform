package com.agentplatform.backend.tasks;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agent_task_associations", uniqueConstraints = @UniqueConstraint(columnNames = {"agent_id", "task_id"}))
public class AgentTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "agent_id", nullable = false)
    private Long agentId;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "assigned_at")
    private Instant assignedAt = Instant.now();

    @Column(name = "assigned_by", nullable = false)
    private Long assignedBy; // User ID who assigned the agent

    public AgentTask() {}

    public AgentTask(Long agentId, Long taskId, Long assignedBy) {
        this.agentId = agentId;
        this.taskId = taskId;
        this.assignedBy = assignedBy;
        this.assignedAt = Instant.now();
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
