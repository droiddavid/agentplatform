package com.agentplatform.backend.runs;

import com.agentplatform.backend.agents.Agent;
import com.agentplatform.backend.agents.AgentRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class GraphViewBuilder {
    private final MessageService messageService;
    private final TaskBoardItemService taskBoardItemService;
    private final SharedContextEntryService contextService;
    private final AgentRepository agentRepository;
    private final RunRepository runRepository;

    public GraphViewBuilder(MessageService messageService, 
                          TaskBoardItemService taskBoardItemService,
                          SharedContextEntryService contextService,
                          AgentRepository agentRepository,
                          RunRepository runRepository) {
        this.messageService = messageService;
        this.taskBoardItemService = taskBoardItemService;
        this.contextService = contextService;
        this.agentRepository = agentRepository;
        this.runRepository = runRepository;
    }

    /**
     * Build complete graph view for a run
     */
    public GraphView buildGraphForRun(String runId) {
        List<GraphNode> nodes = buildNodes(runId);
        List<GraphEdge> edges = buildEdges(runId, nodes);
        
        GraphView graphView = new GraphView();
        graphView.setId(UUID.randomUUID().toString());
        graphView.setRunId(runId);
        graphView.setNodes(nodes);
        graphView.setEdges(edges);
        graphView.setCreatedAt(Instant.now());
        graphView.setStatistics(computeGraphStatistics(nodes, edges));
        
        return graphView;
    }

    /**
     * Build graph nodes from agents, tasks, and execution events
     */
    private List<GraphNode> buildNodes(String runId) {
        List<GraphNode> nodes = new ArrayList<>();
        AtomicInteger order = new AtomicInteger(0);

        // Add agent nodes
        nodes.addAll(buildAgentNodes(runId, order));

        // Add task board item nodes
        nodes.addAll(buildTaskBoardNodes(runId, order));

        return nodes;
    }

    /**
     * Build nodes from agents in the run
     */
    private List<GraphNode> buildAgentNodes(String runId, AtomicInteger order) {
        try {
            // Get run to find agents
            Run run = runRepository.findById(Long.parseLong(runId)).orElse(null);
            if (run == null) {
                return Collections.emptyList();
            }

            // Parse agent IDs from the run's agent list (assuming comma-separated or JSON)
            // For now, we'll query all agents and associate them based on message participation
            List<Agent> agents = agentRepository.findAll(); // In production, would be filtered by run

            return agents.stream()
                .map(agent -> {
                    GraphNode node = new GraphNode();
                    node.setId("agent-" + agent.getId());
                    node.setAgentId(agent.getId().toString());
                    node.setAgentName(agent.getName());
                    node.setType("agent");
                    node.setStatus("active");
                    node.setOrder(order.getAndIncrement());
                    node.setCreatedAt(Instant.now());
                    
                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("owner", agent.getOwnerId());
                    metadata.put("description", agent.getDescription());
                    node.setMetadata(metadata);
                    
                    return node;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Build nodes from task board items
     */
    private List<GraphNode> buildTaskBoardNodes(String runId, AtomicInteger order) {
        try {
            // This would need access to TaskBoardItemRepository
            // For now, returning empty - will be populated when service is available
            return Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Build graph edges from messages, delegations, and task flows
     */
    private List<GraphEdge> buildEdges(String runId, List<GraphNode> nodes) {
        List<GraphEdge> edges = new ArrayList<>();

        // Build edges from messages (agent-to-agent communication)
        edges.addAll(buildMessageEdges(runId, nodes));

        // Additional edge types can be added here:
        // - Task delegation edges
        // - Execution flow edges
        // - Collaboration edges

        return edges;
    }

    /**
     * Build edges from message relationships between agents
     */
    private List<GraphEdge> buildMessageEdges(String runId, List<GraphNode> nodes) {
        List<GraphEdge> edges = new ArrayList<>();
        
        try {
            // Note: MessageService.getAllMessages() returns Message objects
            // We need to convert them to edges
            // This is a placeholder - actual implementation depends on Message structure
            
            Map<String, GraphNode> nodeMap = nodes.stream()
                .collect(Collectors.toMap(GraphNode::getId, node -> node));

            // For each message, create an edge from sender to recipient
            // This would be: messageService.getMessagesByRun(runId)
            
        } catch (Exception e) {
            // Log error but don't fail
        }

        return edges;
    }

    /**
     * Compute graph statistics
     */
    private Map<String, Object> computeGraphStatistics(List<GraphNode> nodes, List<GraphEdge> edges) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("nodeCount", nodes.size());
        stats.put("edgeCount", edges.size());
        
        // Count node types
        Map<String, Long> nodeTypeStats = nodes.stream()
            .collect(Collectors.groupingBy(GraphNode::getType, Collectors.counting()));
        stats.put("nodeTypes", nodeTypeStats);

        // Count edge types
        Map<String, Long> edgeTypeStats = edges.stream()
            .collect(Collectors.groupingBy(GraphEdge::getType, Collectors.counting()));
        stats.put("edgeTypes", edgeTypeStats);

        // Calculate average degree
        if (!nodes.isEmpty() && !edges.isEmpty()) {
            double avgDegree = (edges.size() * 2.0) / nodes.size();
            stats.put("averageDegree", avgDegree);
        }

        return stats;
    }

    /**
     * Get subgraph for a specific agent and its connections
     */
    public GraphView buildAgentSubgraph(String runId, String agentId) {
        GraphView fullGraph = buildGraphForRun(runId);
        
        // Filter to agent node and its connected nodes
        String agentNodeId = "agent-" + agentId;
        
        List<GraphNode> filteredNodes = new ArrayList<>();
        Set<String> connectedNodeIds = new HashSet<>();
        connectedNodeIds.add(agentNodeId);

        // Find all nodes connected to the agent
        for (GraphEdge edge : fullGraph.getEdges()) {
            if (agentNodeId.equals(edge.getFromNodeId())) {
                connectedNodeIds.add(edge.getToNodeId());
            } else if (agentNodeId.equals(edge.getToNodeId())) {
                connectedNodeIds.add(edge.getFromNodeId());
            }
        }

        // Filter nodes
        filteredNodes.addAll(fullGraph.getNodes().stream()
            .filter(node -> connectedNodeIds.contains(node.getId()))
            .collect(Collectors.toList()));

        // Filter edges
        List<GraphEdge> filteredEdges = fullGraph.getEdges().stream()
            .filter(edge -> connectedNodeIds.contains(edge.getFromNodeId()) && 
                           connectedNodeIds.contains(edge.getToNodeId()))
            .collect(Collectors.toList());

        GraphView subgraph = new GraphView();
        subgraph.setId(UUID.randomUUID().toString());
        subgraph.setRunId(runId);
        subgraph.setNodes(filteredNodes);
        subgraph.setEdges(filteredEdges);
        subgraph.setCreatedAt(Instant.now());
        subgraph.setStatistics(computeGraphStatistics(filteredNodes, filteredEdges));

        return subgraph;
    }

    /**
     * Filter graph by edge type (messages, delegations, tasks, etc.)
     */
    public List<GraphEdge> getEdgesByType(GraphView graphView, String edgeType) {
        if (graphView == null || graphView.getEdges() == null) {
            return Collections.emptyList();
        }
        
        return graphView.getEdges().stream()
            .filter(edge -> edgeType.equals(edge.getType()))
            .collect(Collectors.toList());
    }

    /**
     * Get connected agents for a specific agent
     */
    public List<String> getConnectedAgents(GraphView graphView, String agentNodeId) {
        if (graphView == null || graphView.getEdges() == null) {
            return Collections.emptyList();
        }

        Set<String> connectedAgents = new HashSet<>();
        
        for (GraphEdge edge : graphView.getEdges()) {
            if (agentNodeId.equals(edge.getFromNodeId())) {
                connectedAgents.add(edge.getToNodeId());
            } else if (agentNodeId.equals(edge.getToNodeId())) {
                connectedAgents.add(edge.getFromNodeId());
            }
        }

        return new ArrayList<>(connectedAgents);
    }
}
