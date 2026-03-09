package com.agentplatform.backend.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class ModelGatewayService {

    private final String gatewayUrl;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public ModelGatewayService(@Value("${model.gateway.url:http://localhost:11434}") String gatewayUrl) {
        this.gatewayUrl = gatewayUrl;
    }

    /**
     * Sends a prompt to the configured model gateway and returns the raw response body.
     * This is a minimal stub suitable for development against a local Ollama HTTP endpoint.
     */
    public String generate(String model, String prompt) throws Exception {
        String payload = "{\"model\":\"" + escapeJson(model) + "\",\"prompt\":\"" + escapeJson(prompt) + "\"}";
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(gatewayUrl + "/api/generate"))
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        if (resp.statusCode() >= 200 && resp.statusCode() < 300) {
            return resp.body();
        }
        throw new RuntimeException("Model gateway error: " + resp.statusCode() + " - " + resp.body());
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
