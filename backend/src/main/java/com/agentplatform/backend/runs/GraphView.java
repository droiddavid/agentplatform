package com.agentplatform.backend.runs;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class GraphView {
    private String id;
    private String runId;
    private List<GraphNode> nodes;
    private List<GraphEdge> edges;
    private Map<String, Object> statistics;
    private Instant createdAt;
    private Map<String, Object> metadata;

    // Constructors
    public GraphView() {
    }

    public GraphView(String runId, List<GraphNode> nodes, List<GraphEdge> edges) {
        this.runId = runId;
        this.nodes = nodes;
        this.edges = edges;
    }

    public GraphView(String id, String runId, List<GraphNode> nodes, List<GraphEdge> edges, Instant createdAt) {
        this.id = id;
        this.runId = runId;
        this.nodes = nodes;
        this.edges = edges;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public List<GraphNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<GraphNode> nodes) {
        this.nodes = nodes;
    }

    public List<GraphEdge> getEdges() {
        return edges;
    }

    public void setEdges(List<GraphEdge> edges) {
        this.edges = edges;
    }

    public Map<String, Object> getStatistics() {
        return statistics;
    }

    public void setStatistics(Map<String, Object> statistics) {
        this.statistics = statistics;
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
