package com.agentplatform.backend.agents;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agent_capabilities")
public class AgentCapability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(nullable = false)
    private String capabilityName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Boolean enabled = true;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public AgentCapability() {}

    public AgentCapability(Agent agent, String capabilityName, String description) {
        this.agent = agent;
        this.capabilityName = capabilityName;
        this.description = description;
        this.enabled = true;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }
    public String getCapabilityName() { return capabilityName; }
    public void setCapabilityName(String capabilityName) { this.capabilityName = capabilityName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public Instant getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "AgentCapability{" +
                "id=" + id +
                ", capabilityName='" + capabilityName + '\'' +
                ", enabled=" + enabled +
                '}';
    }
}
