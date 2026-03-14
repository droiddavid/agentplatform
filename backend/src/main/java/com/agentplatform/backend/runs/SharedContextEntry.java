package com.agentplatform.backend.runs;

import jakarta.persistence.*;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.Instant;

@Entity
@Table(name = "shared_context_entries")
public class SharedContextEntry {
    @Id
    @Column(length = 26)
    private String id;

    @Column(name = "run_id", length = 26, nullable = false)
    private String runId;

    @Column(name = "created_by_run_agent_id", length = 26)
    private String createdByRunAgentId;

    @Column(name = "context_key", nullable = false, length = 120)
    private String contextKey;

    @Column(name = "context_value_json", columnDefinition = "JSON", nullable = false)
    private String contextValueJson;

    @Column(name = "visibility_scope", nullable = false)
    private String visibilityScope = "SHARED";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    // Constructors
    public SharedContextEntry() {
    }

    public SharedContextEntry(String id, String runId, String contextKey, String contextValueJson) {
        this.id = id;
        this.runId = runId;
        this.contextKey = contextKey;
        this.contextValueJson = contextValueJson;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public SharedContextEntry(String id, String runId, String createdByRunAgentId, String contextKey, String contextValueJson, String visibilityScope) {
        this.id = id;
        this.runId = runId;
        this.createdByRunAgentId = createdByRunAgentId;
        this.contextKey = contextKey;
        this.contextValueJson = contextValueJson;
        this.visibilityScope = visibilityScope;
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

    public String getContextKey() {
        return contextKey;
    }

    public void setContextKey(String contextKey) {
        this.contextKey = contextKey;
    }

    public String getContextValueJson() {
        return contextValueJson;
    }

    public void setContextValueJson(String contextValueJson) {
        this.contextValueJson = contextValueJson;
    }

    public String getVisibilityScope() {
        return visibilityScope;
    }

    public void setVisibilityScope(String visibilityScope) {
        this.visibilityScope = visibilityScope;
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
}
