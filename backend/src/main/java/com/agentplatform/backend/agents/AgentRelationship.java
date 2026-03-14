package com.agentplatform.backend.agents;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agent_relationships")
public class AgentRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_agent_id", nullable = false)
    private Agent primaryAgent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_agent_id", nullable = false)
    private Agent relatedAgent;

    @Column
    private String relationshipType = "collaborator";

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public AgentRelationship() {}

    public AgentRelationship(Agent primaryAgent, Agent relatedAgent, String relationshipType) {
        this.primaryAgent = primaryAgent;
        this.relatedAgent = relatedAgent;
        this.relationshipType = relationshipType;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Agent getPrimaryAgent() { return primaryAgent; }
    public void setPrimaryAgent(Agent primaryAgent) { this.primaryAgent = primaryAgent; }
    public Agent getRelatedAgent() { return relatedAgent; }
    public void setRelatedAgent(Agent relatedAgent) { this.relatedAgent = relatedAgent; }
    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }
    public Instant getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "AgentRelationship{" +
                "id=" + id +
                ", relationshipType='" + relationshipType + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
