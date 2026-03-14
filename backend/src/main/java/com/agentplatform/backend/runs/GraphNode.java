package com.agentplatform.backend.runs;

import java.time.Instant;
import java.util.Map;

public class GraphNode {
    private String id;
    private String agentId;
    private String agentName;
    private String type; // agent, task, execution_event
    private String status;
    private Integer order;
    private Instant createdAt;
    private Map<String, Object> metadata;

    // Constructors
    public GraphNode() {
    }

    public GraphNode(String id, String agentId, String agentName, String type, String status) {
        this.id = id;
        this.agentId = agentId;
        this.agentName = agentName;
        this.type = type;
        this.status = status;
    }

    public GraphNode(String id, String agentId, String agentName, String type, String status, Integer order, Instant createdAt) {
        this.id = id;
        this.agentId = agentId;
        this.agentName = agentName;
        this.type = type;
        this.status = status;
        this.order = order;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
