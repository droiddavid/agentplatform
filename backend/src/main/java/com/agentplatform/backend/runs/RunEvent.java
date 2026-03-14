package com.agentplatform.backend.runs;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "run_events")
public class RunEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "run_id", nullable = false)
    private Long runId;

    @Column(nullable = false)
    private Long sequence;

    @Column(name = "event_type", nullable = false)
    private String eventType; // started, message, action, approval_needed, completed, failed, etc.

    @Column(columnDefinition = "LONGTEXT")
    private String payload; // JSON details of the event

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RunEvent() {}

    public RunEvent(Long runId, Long sequence, String eventType, String payload) {
        this.runId = runId;
        this.sequence = sequence;
        this.eventType = eventType;
        this.payload = payload;
    }

    public Long getId() { return id; }

    public Long getRunId() { return runId; }
    public void setRunId(Long runId) { this.runId = runId; }

    public Long getSequence() { return sequence; }
    public void setSequence(Long sequence) { this.sequence = sequence; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
