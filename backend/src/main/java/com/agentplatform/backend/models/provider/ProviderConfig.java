package com.agentplatform.backend.models.provider;

import java.util.Map;

/**
 * Configuration information for a model provider
 */
public class ProviderConfig {
    private String name;
    private String type; // "local" or "cloud"
    private String endpoint;
    private boolean enabled;
    private String defaultModel;
    private Map<String, Object> metadata;

    public ProviderConfig() {
    }

    public ProviderConfig(String name, String type, String endpoint, boolean enabled, String defaultModel) {
        this.name = name;
        this.type = type;
        this.endpoint = endpoint;
        this.enabled = enabled;
        this.defaultModel = defaultModel;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getDefaultModel() {
        return defaultModel;
    }

    public void setDefaultModel(String defaultModel) {
        this.defaultModel = defaultModel;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
