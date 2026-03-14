package com.agentplatform.backend.runs;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/runs")
public class GraphViewController {
    private final GraphViewBuilder graphViewBuilder;

    public GraphViewController(GraphViewBuilder graphViewBuilder) {
        this.graphViewBuilder = graphViewBuilder;
    }

    /**
     * GET /api/runs/{runId}/graph
     * Retrieve complete graph view for a run
     */
    @GetMapping("/{runId}/graph")
    public ResponseEntity<?> getGraphView(@PathVariable String runId) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            return ResponseEntity.ok(graphView);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to build graph view: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/nodes
     * Retrieve only nodes from the graph
     */
    @GetMapping("/{runId}/graph/nodes")
    public ResponseEntity<?> getGraphNodes(@PathVariable String runId) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            return ResponseEntity.ok(Map.of(
                "runId", runId,
                "nodeCount", graphView.getNodes().size(),
                "nodes", graphView.getNodes()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve graph nodes: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/edges
     * Retrieve edges from the graph, optionally filtered by type
     */
    @GetMapping("/{runId}/graph/edges")
    public ResponseEntity<?> getGraphEdges(
            @PathVariable String runId,
            @RequestParam(required = false) String type) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            
            Object edgeData;
            if (type != null && !type.isEmpty()) {
                edgeData = graphViewBuilder.getEdgesByType(graphView, type);
            } else {
                edgeData = graphView.getEdges();
            }

            return ResponseEntity.ok(Map.of(
                "runId", runId,
                "type", type != null ? type : "all",
                "edgeCount", graphView.getEdges().size(),
                "edges", edgeData
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve graph edges: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/stats
     * Retrieve graph statistics
     */
    @GetMapping("/{runId}/graph/stats")
    public ResponseEntity<?> getGraphStats(@PathVariable String runId) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            return ResponseEntity.ok(Map.of(
                "runId", runId,
                "statistics", graphView.getStatistics()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve graph statistics: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/subgraph/{agentId}
     * Retrieve subgraph for a specific agent and its connections
     */
    @GetMapping("/{runId}/graph/subgraph/{agentId}")
    public ResponseEntity<?> getAgentSubgraph(
            @PathVariable String runId,
            @PathVariable String agentId) {
        try {
            GraphView subgraph = graphViewBuilder.buildAgentSubgraph(runId, agentId);
            return ResponseEntity.ok(subgraph);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to build agent subgraph: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/node/{nodeId}
     * Retrieve specific node details with connected edges
     */
    @GetMapping("/{runId}/graph/node/{nodeId}")
    public ResponseEntity<?> getNodeDetails(
            @PathVariable String runId,
            @PathVariable String nodeId) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            
            // Find the node
            var node = graphView.getNodes().stream()
                .filter(n -> nodeId.equals(n.getId()))
                .findFirst();

            if (node.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Node not found: " + nodeId));
            }

            // Find connected edges
            var connectedEdges = graphView.getEdges().stream()
                .filter(e -> nodeId.equals(e.getFromNodeId()) || nodeId.equals(e.getToNodeId()))
                .toList();

            // Find connected nodes
            var connectedNodeIds = graphView.getEdges().stream()
                .filter(e -> nodeId.equals(e.getFromNodeId()))
                .map(GraphEdge::getToNodeId)
                .toList();
            
            var incomingNodeIds = graphView.getEdges().stream()
                .filter(e -> nodeId.equals(e.getToNodeId()))
                .map(GraphEdge::getFromNodeId)
                .toList();

            var connectedNodes = graphView.getNodes().stream()
                .filter(n -> connectedNodeIds.contains(n.getId()) || incomingNodeIds.contains(n.getId()))
                .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("runId", runId);
            response.put("node", node.get());
            response.put("connectedEdges", connectedEdges);
            response.put("connectedNodes", connectedNodes);
            response.put("outgoingConnections", connectedNodeIds.size());
            response.put("incomingConnections", incomingNodeIds.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve node details: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/edge/{edgeId}
     * Retrieve specific edge details
     */
    @GetMapping("/{runId}/graph/edge/{edgeId}")
    public ResponseEntity<?> getEdgeDetails(
            @PathVariable String runId,
            @PathVariable String edgeId) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            
            // Find the edge
            var edge = graphView.getEdges().stream()
                .filter(e -> edgeId.equals(e.getId()))
                .findFirst();

            if (edge.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Edge not found: " + edgeId));
            }

            // Find the from and to nodes
            var fromNode = graphView.getNodes().stream()
                .filter(n -> edge.get().getFromNodeId().equals(n.getId()))
                .findFirst();
            
            var toNode = graphView.getNodes().stream()
                .filter(n -> edge.get().getToNodeId().equals(n.getId()))
                .findFirst();

            Map<String, Object> response = new HashMap<>();
            response.put("runId", runId);
            response.put("edge", edge.get());
            response.put("fromNode", fromNode.orElse(null));
            response.put("toNode", toNode.orElse(null));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve edge details: " + e.getMessage()));
        }
    }

    /**
     * GET /api/runs/{runId}/graph/agent/{agentId}/connections
     * Get all connected agents for a specific agent
     */
    @GetMapping("/{runId}/graph/agent/{agentId}/connections")
    public ResponseEntity<?> getAgentConnections(
            @PathVariable String runId,
            @PathVariable String agentId) {
        try {
            String agentNodeId = "agent-" + agentId;
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            var connectedAgents = graphViewBuilder.getConnectedAgents(graphView, agentNodeId);

            return ResponseEntity.ok(Map.of(
                "runId", runId,
                "agentId", agentId,
                "connectionCount", connectedAgents.size(),
                "connections", connectedAgents
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve agent connections: " + e.getMessage()));
        }
    }

    /**
     * HEAD /api/runs/{runId}/graph
     * Health check for graph availability
     */
    @RequestMapping(value = "/{runId}/graph", method = org.springframework.web.bind.annotation.RequestMethod.HEAD)
    public ResponseEntity<?> checkGraphAvailability(@PathVariable String runId) {
        try {
            GraphView graphView = graphViewBuilder.buildGraphForRun(runId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}
