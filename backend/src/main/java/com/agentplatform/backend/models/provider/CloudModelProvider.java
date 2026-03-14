package com.agentplatform.backend.models.provider;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.*;

/**
 * Cloud model provider adapter - supports OpenAI and Azure OpenAI APIs
 */
@Component
@ConditionalOnProperty(name = "models.provider.cloud.enabled", havingValue = "true", matchIfMissing = false)
public class CloudModelProvider implements IModelProvider {

    @Value("${models.provider.cloud.type:openai}")
    private String providerType; // "openai" or "azure"

    @Value("${models.provider.cloud.endpoint:https://api.openai.com}")
    private String endpoint;

    @Value("${models.provider.cloud.api-key:}")
    private String apiKey;

    @Value("${models.provider.cloud.model:gpt-3.5-turbo}")
    private String defaultModel;

    @Value("${models.provider.cloud.deployment-id:}")
    private String deploymentId; // For Azure OpenAI

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CloudModelProvider(RestTemplate modelProviderRestTemplate, ObjectMapper objectMapper) {
        this.restTemplate = modelProviderRestTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public String getName() {
        return "cloud-" + providerType;
    }

    @Override
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public ModelProviderResponse sendRequest(ModelProviderRequest request) throws ProviderException {
        if (!isAvailable()) {
            throw new ProviderException(getName(), "NOT_CONFIGURED", "Cloud provider API key not configured");
        }

        try {
            String model = request.getModel() != null ? request.getModel() : defaultModel;
            
            // Build request for cloud API
            ChatCompletionRequest cloudRequest = new ChatCompletionRequest(model, request);
            
            String url = buildUrl(model);
            HttpEntity<String> entity = buildHttpRequest(cloudRequest);
            
            ChatCompletionResponse cloudResponse = restTemplate.postForObject(url, entity, ChatCompletionResponse.class);
            
            if (cloudResponse == null || cloudResponse.getChoices().isEmpty()) {
                throw new ProviderException(getName(), "NULL_RESPONSE", "Received null or empty response from provider");
            }

            // Normalize response
            ChatCompletionResponse.Choice choice = cloudResponse.getChoices().get(0);
            ModelProviderResponse response = new ModelProviderResponse();
            response.setId(cloudResponse.getId());
            response.setContent(choice.getMessage().getContent());
            response.setModel(cloudResponse.getModel());
            response.setStatus("success");
            response.setInputTokens(cloudResponse.getUsage().getPromptTokens());
            response.setOutputTokens(cloudResponse.getUsage().getCompletionTokens());
            response.setTotalTokens(cloudResponse.getUsage().getTotalTokens());
            response.setCreatedAt(java.time.Instant.now());

            return response;
        } catch (RestClientException e) {
            throw new ProviderException(getName(), "CONNECTION_ERROR", "Failed to connect to cloud provider: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new ProviderException(getName(), "ERROR", "Request failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String[] getAvailableModels() {
        // Return configured models - in production this could query the API
        return new String[]{
            defaultModel,
            "gpt-4",
            "gpt-3.5-turbo",
            "text-davinci-003",
            "text-davinci-002"
        };
    }

    @Override
    public ProviderConfig getConfig() {
        return new ProviderConfig(
            getName(),
            "cloud",
            endpoint,
            isAvailable(),
            defaultModel
        );
    }

    @Override
    public void testConnection() throws ProviderException {
        if (!isAvailable()) {
            throw new ProviderException(getName(), "NOT_CONFIGURED", "Cloud provider not configured");
        }
        // In production, could make a simple test request
    }

    /**
     * Build URL based on provider type
     */
    private String buildUrl(String model) {
        if ("azure".equals(providerType)) {
            return endpoint + "/openai/deployments/" + (deploymentId != null ? deploymentId : model) + "/chat/completions?api-version=2024-02-15-preview";
        } else {
            return endpoint + "/v1/chat/completions";
        }
    }

    /**
     * Build HTTP request with appropriate headers
     */
    private HttpEntity<String> buildHttpRequest(ChatCompletionRequest request) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        if ("azure".equals(providerType)) {
            headers.set("api-key", apiKey);
        } else {
            headers.set("Authorization", "Bearer " + apiKey);
        }

        String body = objectMapper.writeValueAsString(request);
        return new HttpEntity<>(body, headers);
    }

    /**
     * Inner class for Chat Completion request
     */
    public static class ChatCompletionRequest {
        private String model;
        private List<Message> messages;
        private double temperature;
        @JsonProperty("max_tokens")
        private int maxTokens;
        @JsonProperty("top_p")
        private double topP;

        public ChatCompletionRequest(String model, ModelProviderRequest request) {
            this.model = model;
            this.temperature = request.getTemperature();
            this.maxTokens = request.getMaxTokens();
            this.topP = request.getTopP();
            
            // Build messages list
            this.messages = new ArrayList<>();
            
            // Add system prompt if provided
            if (request.getSystemPrompt() != null) {
                this.messages.add(new Message("system", request.getSystemPrompt()));
            }
            
            // Add conversation messages
            if (request.getMessages() != null) {
                for (ModelProviderRequest.Message msg : request.getMessages()) {
                    this.messages.add(new Message(msg.getRole(), msg.getContent()));
                }
            }
        }

        // Getters
        public String getModel() {
            return model;
        }

        public List<Message> getMessages() {
            return messages;
        }

        public double getTemperature() {
            return temperature;
        }

        public int getMaxTokens() {
            return maxTokens;
        }

        public double getTopP() {
            return topP;
        }

        public static class Message {
            private String role;
            private String content;

            public Message(String role, String content) {
                this.role = role;
                this.content = content;
            }

            public String getRole() {
                return role;
            }

            public String getContent() {
                return content;
            }
        }
    }

    /**
     * Inner class for Chat Completion response
     */
    public static class ChatCompletionResponse {
        private String id;
        private String model;
        private List<Choice> choices;
        private Usage usage;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public List<Choice> getChoices() {
            return choices;
        }

        public void setChoices(List<Choice> choices) {
            this.choices = choices;
        }

        public Usage getUsage() {
            return usage;
        }

        public void setUsage(Usage usage) {
            this.usage = usage;
        }

        public static class Choice {
            private Message message;

            public Message getMessage() {
                return message;
            }

            public void setMessage(Message message) {
                this.message = message;
            }

            public static class Message {
                private String content;

                public String getContent() {
                    return content;
                }

                public void setContent(String content) {
                    this.content = content;
                }
            }
        }

        public static class Usage {
            @JsonProperty("prompt_tokens")
            private int promptTokens;

            @JsonProperty("completion_tokens")
            private int completionTokens;

            @JsonProperty("total_tokens")
            private int totalTokens;

            public int getPromptTokens() {
                return promptTokens;
            }

            public int getCompletionTokens() {
                return completionTokens;
            }

            public int getTotalTokens() {
                return totalTokens;
            }
        }
    }
}
