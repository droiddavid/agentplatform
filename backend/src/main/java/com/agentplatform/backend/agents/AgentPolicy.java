package com.agentplatform.backend.agents;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agent_policies")
public class AgentPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(nullable = false)
    private String policyName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String policyValue;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public AgentPolicy() {}

    public AgentPolicy(Agent agent, String policyName, String policyValue) {
        this.agent = agent;
        this.policyName = policyName;
        this.policyValue = policyValue;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }
    public String getPolicyName() { return policyName; }
    public void setPolicyName(String policyName) { this.policyName = policyName; }
    public String getPolicyValue() { return policyValue; }
    public void setPolicyValue(String policyValue) { this.policyValue = policyValue; }
    public Instant getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "AgentPolicy{" +
                "id=" + id +
                ", policyName='" + policyName + '\'' +
                ", policyValue='" + policyValue + '\'' +
                '}';
    }
}
