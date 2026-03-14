package com.agentplatform.backend.models.provider;

import java.util.List;
import java.util.Map;

/**
 * Normalized request to send a prompt to any model provider.
 * Abstracts away provider-specific formatting.
 */
public class ModelProviderRequest {
    private String model;
    private String systemPrompt;
    private List<Message> messages;
    private int maxTokens;
    private double temperature;
    private double topP;
    private Map<String, Object> additionalParams;

    public ModelProviderRequest() {
    }

    public ModelProviderRequest(String model, String systemPrompt, List<Message> messages) {
        this.model = model;
        this.systemPrompt = systemPrompt;
        this.messages = messages;
        this.maxTokens = 2048;
        this.temperature = 0.7;
        this.topP = 0.95;
    }

    // Getters and Setters
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSystemPrompt() {
        return systemPrompt;
    }

    public void setSystemPrompt(String systemPrompt) {
        this.systemPrompt = systemPrompt;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(int maxTokens) {
        this.maxTokens = maxTokens;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getTopP() {
        return topP;
    }

    public void setTopP(double topP) {
        this.topP = topP;
    }

    public Map<String, Object> getAdditionalParams() {
        return additionalParams;
    }

    public void setAdditionalParams(Map<String, Object> additionalParams) {
        this.additionalParams = additionalParams;
    }

    /**
     * Inner class representing a message in the conversation
     */
    public static class Message {
        private String role; // "system", "user", "assistant"
        private String content;

        public Message() {
        }

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
