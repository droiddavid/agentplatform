package com.agentplatform.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for model provider clients
 */
@Configuration
public class ModelProviderConfig {

    /**
     * RestTemplate bean for making HTTP calls to model providers
     */
    @Bean
    public RestTemplate modelProviderRestTemplate() {
        ClientHttpRequestFactory factory = new BufferingClientHttpRequestFactory(
            new SimpleClientHttpRequestFactory()
        );
        RestTemplate restTemplate = new RestTemplate(factory);
        return restTemplate;
    }
}
