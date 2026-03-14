package com.agentplatform.backend.models.provider;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for model provider operations
 */
@RestController
@RequestMapping("/api/models/provider")
public class ModelProviderController {
    private final ModelGatewayService modelGatewayService;

    public ModelProviderController(ModelGatewayService modelGatewayService) {
        this.modelGatewayService = modelGatewayService;
    }

    /**
     * GET /api/models/provider/available
     * Get list of available model providers
     */
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableProviders() {
        try {
            var providers = modelGatewayService.getAvailableProviders();
            return ResponseEntity.ok(Map.of(
                "providers", providers,
                "count", providers.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve providers: " + e.getMessage()));
        }
    }

    /**
     * GET /api/models/provider/models
     * Get all available models from all providers
     */
    @GetMapping("/models")
    public ResponseEntity<?> getAvailableModels() {
        try {
            var models = modelGatewayService.getAvailableModels();
            return ResponseEntity.ok(Map.of(
                "models", models,
                "providerCount", models.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve models: " + e.getMessage()));
        }
    }

    /**
     * GET /api/models/provider/status
     * Test all providers and return status
     */
    @GetMapping("/status")
    public ResponseEntity<?> getProviderStatus() {
        try {
            var status = modelGatewayService.testAllProviders();
            boolean allHealthy = status.values().stream().allMatch(s -> s);
            
            return ResponseEntity.ok(Map.of(
                "status", status,
                "healthy", allHealthy,
                "timestamp", java.time.Instant.now()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to test providers: " + e.getMessage()));
        }
    }

    /**
     * POST /api/models/provider/generate
     * Send a prompt to a model provider and get a result
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateFromModel(
            @RequestBody GenerateRequest request) {
        try {
            if (request.getPrompt() == null || request.getPrompt().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Prompt is required"));
            }

            // Build normalized request
            ModelProviderRequest providerRequest = new ModelProviderRequest();
            providerRequest.setModel(request.getModel());
            providerRequest.setSystemPrompt(request.getSystemPrompt());
            providerRequest.setMaxTokens(request.getMaxTokens() != null ? request.getMaxTokens() : 2048);
            providerRequest.setTemperature(request.getTemperature() != null ? request.getTemperature() : 0.7);
            providerRequest.setTopP(request.getTopP() != null ? request.getTopP() : 0.95);

            // Build messages list
            var messages = new java.util.ArrayList<ModelProviderRequest.Message>();
            if (request.getSystemPrompt() != null) {
                messages.add(new ModelProviderRequest.Message("system", request.getSystemPrompt()));
            }
            messages.add(new ModelProviderRequest.Message("user", request.getPrompt()));
            providerRequest.setMessages(messages);

            // Send to gateway
            ModelProviderResponse response = modelGatewayService.sendRequest(
                providerRequest, 
                request.getPreference()
            );

            return ResponseEntity.ok(response);
        } catch (ProviderException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "error", e.getMessage(),
                    "provider", e.getProviderName(),
                    "errorCode", e.getErrorCode()
                ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Generation failed: " + e.getMessage()));
        }
    }

    /**
     * GET /api/models/provider/{providerName}/status
     * Test a specific provider
     */
    @GetMapping("/{providerName}/status")
    public ResponseEntity<?> testProvider(@PathVariable String providerName) {
        try {
            boolean available = modelGatewayService.isProviderAvailable(providerName);
            return ResponseEntity.ok(Map.of(
                "provider", providerName,
                "available", available,
                "timestamp", java.time.Instant.now()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to test provider: " + e.getMessage()));
        }
    }

    /**
     * GET /api/models/provider/{providerName}/models
     * Get models from a specific provider
     */
    @GetMapping("/{providerName}/models")
    public ResponseEntity<?> getProviderModels(@PathVariable String providerName) {
        try {
            IModelProvider provider = modelGatewayService.getProviderByName(providerName);
            if (provider == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of(
                "provider", providerName,
                "models", provider.getAvailableModels(),
                "available", provider.isAvailable()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve provider models: " + e.getMessage()));
        }
    }

    /**
     * Request DTO for model generation
     */
    public static class GenerateRequest {
        private String prompt;
        private String systemPrompt;
        private String model;
        private Integer maxTokens;
        private Double temperature;
        private Double topP;
        private String preference; // "prefer-local", "prefer-cloud", "local-only", "cloud-only"

        // Getters and Setters
        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }

        public String getSystemPrompt() {
            return systemPrompt;
        }

        public void setSystemPrompt(String systemPrompt) {
            this.systemPrompt = systemPrompt;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public Integer getMaxTokens() {
            return maxTokens;
        }

        public void setMaxTokens(Integer maxTokens) {
            this.maxTokens = maxTokens;
        }

        public Double getTemperature() {
            return temperature;
        }

        public void setTemperature(Double temperature) {
            this.temperature = temperature;
        }

        public Double getTopP() {
            return topP;
        }

        public void setTopP(Double topP) {
            this.topP = topP;
        }

        public String getPreference() {
            return preference;
        }

        public void setPreference(String preference) {
            this.preference = preference;
        }
    }
}
