package com.agentplatform.backend.models.provider;

import java.time.Instant;
import java.util.Map;

/**
 * Normalized response from any model provider.
 * All providers normalize their responses to this format.
 */
public class ModelProviderResponse {
    private String id;
    private String content;
    private String model;
    private String status; // success, error, rate_limited, timeout
    private String errorMessage;
    private int inputTokens;
    private int outputTokens;
    private int totalTokens;
    private Instant createdAt;
    private Map<String, Object> metadata;

    public ModelProviderResponse() {
    }

    public ModelProviderResponse(String id, String content, String model, int inputTokens, int outputTokens) {
        this.id = id;
        this.content = content;
        this.model = model;
        this.status = "success";
        this.inputTokens = inputTokens;
        this.outputTokens = outputTokens;
        this.totalTokens = inputTokens + outputTokens;
        this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public int getInputTokens() {
        return inputTokens;
    }

    public void setInputTokens(int inputTokens) {
        this.inputTokens = inputTokens;
    }

    public int getOutputTokens() {
        return outputTokens;
    }

    public void setOutputTokens(int outputTokens) {
        this.outputTokens = outputTokens;
    }

    public int getTotalTokens() {
        return totalTokens;
    }

    public void setTotalTokens(int totalTokens) {
        this.totalTokens = totalTokens;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    /**
     * Check if this response represents a successful completion
     */
    public boolean isSuccess() {
        return "success".equals(status);
    }

    /**
     * Check if this response is an error
     */
    public boolean isError() {
        return !isSuccess();
    }
}
