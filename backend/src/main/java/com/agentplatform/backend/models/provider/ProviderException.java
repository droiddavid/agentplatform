package com.agentplatform.backend.models.provider;

/**
 * Exception thrown when a provider operation fails
 */
public class ProviderException extends Exception {
    private String providerName;
    private String errorCode;

    public ProviderException(String message) {
        super(message);
    }

    public ProviderException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProviderException(String providerName, String errorCode, String message) {
        super(message);
        this.providerName = providerName;
        this.errorCode = errorCode;
    }

    public ProviderException(String providerName, String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.providerName = providerName;
        this.errorCode = errorCode;
    }

    public String getProviderName() {
        return providerName;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
