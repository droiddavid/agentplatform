package com.agentplatform.backend.runs;

public class SharedContextEntryRequest {
    private String runId;
    private String createdByRunAgentId;
    private String contextKey;
    private String contextValueJson;
    private String visibilityScope = "SHARED";

    // Constructors
    public SharedContextEntryRequest() {
    }

    public SharedContextEntryRequest(String runId, String contextKey, String contextValueJson) {
        this.runId = runId;
        this.contextKey = contextKey;
        this.contextValueJson = contextValueJson;
    }

    // Getters and Setters
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
}
