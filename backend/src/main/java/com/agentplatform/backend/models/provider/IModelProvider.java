package com.agentplatform.backend.models.provider;

/**
 * Interface for all model providers (local and cloud).
 * Each provider must implement this contract.
 */
public interface IModelProvider {

    /**
     * Get the name of this provider (e.g., "ollama", "azure-openai", "openai")
     */
    String getName();

    /**
     * Check if this provider is currently enabled and accessible
     */
    boolean isAvailable();

    /**
     * Send a normalized request to the model and get a normalized response
     * @param request the normalized provider request
     * @return the normalized provider response
     */
    ModelProviderResponse sendRequest(ModelProviderRequest request) throws ProviderException;

    /**
     * Get the list of models available from this provider
     */
    String[] getAvailableModels();

    /**
     * Get configuration information about this provider (for display/debug purposes)
     */
    ProviderConfig getConfig();

    /**
     * Test the connection to the provider
     */
    void testConnection() throws ProviderException;
}
