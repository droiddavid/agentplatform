package com.agentplatform.backend.runs;

import java.time.Instant;

public class SharedContextEntryResponse {
    private String id;
    private String runId;
    private String createdByRunAgentId;
    private String contextKey;
    private String contextValueJson;
    private String visibilityScope;
    private Instant createdAt;
    private Instant updatedAt;

    // Constructors
    public SharedContextEntryResponse() {
    }

    public SharedContextEntryResponse(SharedContextEntry entry) {
        this.id = entry.getId();
        this.runId = entry.getRunId();
        this.createdByRunAgentId = entry.getCreatedByRunAgentId();
        this.contextKey = entry.getContextKey();
        this.contextValueJson = entry.getContextValueJson();
        this.visibilityScope = entry.getVisibilityScope();
        this.createdAt = entry.getCreatedAt();
        this.updatedAt = entry.getUpdatedAt();
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
