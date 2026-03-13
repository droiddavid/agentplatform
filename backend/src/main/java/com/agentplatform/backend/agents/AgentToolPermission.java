package com.agentplatform.backend.agents;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agent_tool_permissions")
public class AgentToolPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(nullable = false)
    private String toolName;

    @Column
    private String permissionLevel = "execute";

    @Column
    private Boolean requiresApproval = false;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public AgentToolPermission() {}

    public AgentToolPermission(Agent agent, String toolName, String permissionLevel, Boolean requiresApproval) {
        this.agent = agent;
        this.toolName = toolName;
        this.permissionLevel = permissionLevel;
        this.requiresApproval = requiresApproval;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }
    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }
    public String getPermissionLevel() { return permissionLevel; }
    public void setPermissionLevel(String permissionLevel) { this.permissionLevel = permissionLevel; }
    public Boolean getRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(Boolean requiresApproval) { this.requiresApproval = requiresApproval; }
    public Instant getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "AgentToolPermission{" +
                "id=" + id +
                ", toolName='" + toolName + '\'' +
                ", permissionLevel='" + permissionLevel + '\'' +
                ", requiresApproval=" + requiresApproval +
                '}';
    }
}
