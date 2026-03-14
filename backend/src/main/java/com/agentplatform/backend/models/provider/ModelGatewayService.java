package com.agentplatform.backend.models.provider;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * Central gateway service for routing model requests to appropriate provider
 */
@Service
public class ModelGatewayService {
    private final LocalModelProvider localProvider;
    private final CloudModelProvider cloudProvider;

    public ModelGatewayService(LocalModelProvider localProvider, CloudModelProvider cloudProvider) {
        this.localProvider = localProvider;
        this.cloudProvider = cloudProvider;
    }

    /**
     * Send request to the best available provider
     * @param request the model request
     * @param preferences user's model preferences (e.g., "prefer-local", "prefer-cloud", "cloud-only")
     * @return response from the selected provider
     */
    public ModelProviderResponse sendRequest(ModelProviderRequest request, String preferences) throws ProviderException {
        IModelProvider provider = selectProvider(preferences);
        if (provider == null) {
            throw new ProviderException("NO_PROVIDER_AVAILABLE", "NO_PROVIDER", 
                "No model provider is currently available. Please configure a provider.");
        }

        try {
            return provider.sendRequest(request);
        } catch (ProviderException e) {
            // If preferred provider fails, try fallback
            IModelProvider fallback = getFallbackProvider(provider);
            if (fallback != null) {
                return fallback.sendRequest(request);
            }
            throw e;
        }
    }

    /**
     * Get list of all available providers
     */
    public List<ProviderConfig> getAvailableProviders() {
        List<ProviderConfig> providers = new ArrayList<>();
        
        if (localProvider != null && localProvider.isAvailable()) {
            providers.add(localProvider.getConfig());
        }
        
        if (cloudProvider != null && cloudProvider.isAvailable()) {
            providers.add(cloudProvider.getConfig());
        }
        
        return providers;
    }

    /**
     * Get all available models from all providers
     */
    public Map<String, String[]> getAvailableModels() {
        Map<String, String[]> models = new HashMap<>();
        
        if (localProvider != null && localProvider.isAvailable()) {
            models.put(localProvider.getName(), localProvider.getAvailableModels());
        }
        
        if (cloudProvider != null && cloudProvider.isAvailable()) {
            models.put(cloudProvider.getName(), cloudProvider.getAvailableModels());
        }
        
        return models;
    }

    /**
     * Test all providers and return status
     */
    public Map<String, Boolean> testAllProviders() {
        Map<String, Boolean> status = new HashMap<>();
        
        if (localProvider != null) {
            try {
                localProvider.testConnection();
                status.put(localProvider.getName(), true);
            } catch (ProviderException e) {
                status.put(localProvider.getName(), false);
            }
        }
        
        if (cloudProvider != null) {
            try {
                cloudProvider.testConnection();
                status.put(cloudProvider.getName(), true);
            } catch (ProviderException e) {
                status.put(cloudProvider.getName(), false);
            }
        }
        
        return status;
    }

    /**
     * Select the appropriate provider based on preferences
     * @param preferences user preference string
     * @return the selected provider, or null if none available
     */
    private IModelProvider selectProvider(String preferences) {
        if (preferences == null || preferences.isBlank()) {
            // Default: try cloud first if available, then local
            if (cloudProvider != null && cloudProvider.isAvailable()) {
                return cloudProvider;
            }
            if (localProvider != null && localProvider.isAvailable()) {
                return localProvider;
            }
            return null;
        }

        switch (preferences.toLowerCase()) {
            case "local-only":
                if (localProvider != null && localProvider.isAvailable()) {
                    return localProvider;
                }
                return null;

            case "cloud-only":
                if (cloudProvider != null && cloudProvider.isAvailable()) {
                    return cloudProvider;
                }
                return null;

            case "prefer-local":
                if (localProvider != null && localProvider.isAvailable()) {
                    return localProvider;
                }
                if (cloudProvider != null && cloudProvider.isAvailable()) {
                    return cloudProvider;
                }
                return null;

            case "prefer-cloud":
            default:
                if (cloudProvider != null && cloudProvider.isAvailable()) {
                    return cloudProvider;
                }
                if (localProvider != null && localProvider.isAvailable()) {
                    return localProvider;
                }
                return null;
        }
    }

    /**
     * Get a fallback provider if the primary one fails
     */
    private IModelProvider getFallbackProvider(IModelProvider primary) {
        if (primary == localProvider) {
            return cloudProvider;
        } else if (primary == cloudProvider) {
            return localProvider;
        }
        return null;
    }

    /**
     * Get provider by name
     */
    public IModelProvider getProviderByName(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }

        if (localProvider != null && localProvider.getName().equals(name)) {
            return localProvider;
        }
        
        if (cloudProvider != null && cloudProvider.getName().equals(name)) {
            return cloudProvider;
        }
        
        return null;
    }

    /**
     * Check if a specific provider is available
     */
    public boolean isProviderAvailable(String providerName) {
        IModelProvider provider = getProviderByName(providerName);
        return provider != null && provider.isAvailable();
    }
}
