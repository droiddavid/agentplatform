package com.agentplatform.backend.models.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.*;

/**
 * Local model provider adapter - supports Ollama and compatible APIs
 */
@Component
@ConditionalOnProperty(name = "models.provider.local.enabled", havingValue = "true", matchIfMissing = false)
public class LocalModelProvider implements IModelProvider {

    @Value("${models.provider.local.endpoint:http://localhost:11434}")
    private String endpoint;

    @Value("${models.provider.local.default-model:llama2}")
    private String defaultModel;

    @Value("${models.provider.local.timeout:60000}")
    private long timeout;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LocalModelProvider(RestTemplate modelProviderRestTemplate, ObjectMapper objectMapper) {
        this.restTemplate = modelProviderRestTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public String getName() {
        return "local-ollama";
    }

    @Override
    public boolean isAvailable() {
        try {
            testConnection();
            return true;
        } catch (ProviderException e) {
            return false;
        }
    }

    @Override
    public ModelProviderResponse sendRequest(ModelProviderRequest request) throws ProviderException {
        try {
            String model = request.getModel() != null ? request.getModel() : defaultModel;
            
            // Build request for Ollama API
            OllamaRequest ollamaRequest = new OllamaRequest(model, buildPrompt(request), false);
            
            String url = endpoint + "/api/generate";
            OllamaResponse ollamaResponse = restTemplate.postForObject(url, ollamaRequest, OllamaResponse.class);
            
            if (ollamaResponse == null) {
                throw new ProviderException(getName(), "NULL_RESPONSE", "Received null response from provider");
            }

            // Normalize response
            ModelProviderResponse response = new ModelProviderResponse();
            response.setId(UUID.randomUUID().toString());
            response.setContent(ollamaResponse.getResponse().trim());
            response.setModel(model);
            response.setStatus("success");
            response.setInputTokens(0); // Ollama doesn't provide token counts by default
            response.setOutputTokens(0);
            response.setTotalTokens(0);
            response.setCreatedAt(java.time.Instant.now());

            return response;
        } catch (RestClientException e) {
            throw new ProviderException(getName(), "CONNECTION_ERROR", "Failed to connect to local provider: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new ProviderException(getName(), "ERROR", "Request failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String[] getAvailableModels() {
        try {
            String url = endpoint + "/api/tags";
            OllamaModelsResponse response = restTemplate.getForObject(url, OllamaModelsResponse.class);
            if (response != null && response.getModels() != null) {
                return response.getModels().stream()
                    .map(m -> m.getName())
                    .toArray(String[]::new);
            }
            return new String[]{defaultModel};
        } catch (Exception e) {
            return new String[]{defaultModel};
        }
    }

    @Override
    public ProviderConfig getConfig() {
        return new ProviderConfig(
            getName(),
            "local",
            endpoint,
            isAvailable(),
            defaultModel
        );
    }

    @Override
    public void testConnection() throws ProviderException {
        try {
            String url = endpoint + "/api/tags";
            restTemplate.getForObject(url, String.class);
        } catch (RestClientException e) {
            throw new ProviderException(getName(), "CONNECTION_FAILED", 
                "Cannot reach local provider at " + endpoint + ": " + e.getMessage(), e);
        }
    }

    /**
     * Build full prompt from request
     */
    private String buildPrompt(ModelProviderRequest request) {
        StringBuilder prompt = new StringBuilder();
        
        if (request.getSystemPrompt() != null) {
            prompt.append(request.getSystemPrompt()).append("\n\n");
        }

        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            for (ModelProviderRequest.Message msg : request.getMessages()) {
                prompt.append(msg.getRole()).append(": ").append(msg.getContent()).append("\n");
            }
        }

        return prompt.toString();
    }

    /**
     * Inner class for Ollama API request
     */
    public static class OllamaRequest {
        private String model;
        private String prompt;
        private boolean stream;

        public OllamaRequest(String model, String prompt, boolean stream) {
            this.model = model;
            this.prompt = prompt;
            this.stream = stream;
        }

        public String getModel() {
            return model;
        }

        public String getPrompt() {
            return prompt;
        }

        public boolean isStream() {
            return stream;
        }
    }

    /**
     * Inner class for Ollama API response
     */
    public static class OllamaResponse {
        private String response;
        private String model;
        private long createdAt;

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public long getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(long createdAt) {
            this.createdAt = createdAt;
        }
    }

    /**
     * Inner class for Ollama models list response
     */
    public static class OllamaModelsResponse {
        private List<ModelInfo> models;

        public List<ModelInfo> getModels() {
            return models;
        }

        public void setModels(List<ModelInfo> models) {
            this.models = models;
        }

        public static class ModelInfo {
            private String name;

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }
        }
    }
}
