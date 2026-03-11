package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.*;
import com.agentplatform.backend.gateway.ModelGatewayService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AgentParserService {

    private final ModelGatewayService modelGatewayService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${model.gateway.model:llama2}")
    private String defaultModel;

    public AgentParserService(ModelGatewayService modelGatewayService) {
        this.modelGatewayService = modelGatewayService;
    }

    /**
     * Parse natural language description into proposed agent specifications
     */
    public AgentParseResponse parseAgentDescription(AgentParseRequest req) throws Exception {
        String model = defaultModel;
        String prompt = buildParsingPrompt(req.getDescription(), req.getUserContext());

        String response = modelGatewayService.generate(model, prompt);
        return parseResponseIntoAgents(response);
    }

    /**
     * Build a structured prompt for the LLM to parse agent descriptions
     */
    private String buildParsingPrompt(String description, String userContext) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert AI assistant that helps users define AI agents for various tasks. ");
        prompt.append("Parse the following natural language agent description and return a structured JSON response.\n\n");

        prompt.append("USER DESCRIPTION:\n");
        prompt.append(description).append("\n\n");

        if (userContext != null && !userContext.isEmpty()) {
            prompt.append("USER CONTEXT:\n");
            prompt.append(userContext).append("\n\n");
        }

        prompt.append("INSTRUCTIONS:\n");
        prompt.append("1. Analyze the description to understand what the user wants.\n");
        prompt.append("2. If the description implies multiple agents, propose multiple agents.\n");
        prompt.append("3. For each proposed agent, extract or infer: name, role, description, goals, capabilities, recommended tools.\n");
        prompt.append("4. Return ONLY valid JSON (no markdown, no extra text) with this structure:\n");
        prompt.append("{\n");
        prompt.append("  \"summary\": \"Brief summary of what was understood\",\n");
        prompt.append("  \"proposedAgents\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"name\": \"Agent name\",\n");
        prompt.append("      \"role\": \"Role/title\",\n");
        prompt.append("      \"description\": \"Agent description\",\n");
        prompt.append("      \"personaStyle\": \"Professional/Creative/etc\",\n");
        prompt.append("      \"goal\": \"Main goal\",\n");
        prompt.append("      \"goalCategory\": \"work/academic/personal/creative\",\n");
        prompt.append("      \"capabilities\": [\"list\", \"of\", \"capabilities\"],\n");
        prompt.append("      \"allowedTools\": [\"list\", \"of\", \"tools\"],\n");
        prompt.append("      \"approvalPolicy\": \"auto|every_action|remember\",\n");
        prompt.append("      \"workAlone\": true,\n");
        prompt.append("      \"enableMemory\": true,\n");
        prompt.append("      \"memoryType\": \"short_term|long_term|hybrid\",\n");
        prompt.append("      \"modelPreference\": \"default\"\n");
        prompt.append("    }\n");
        prompt.append("  ],\n");
        prompt.append("  \"inferredTools\": [\"tools\", \"that\", \"might\", \"help\"],\n");
        prompt.append("  \"suggestedApprovalPolicy\": \"auto|every_action|remember\",\n");
        prompt.append("  \"suggestedCollaborationStructure\": \"Description of how agents should collaborate\",\n");
        prompt.append("  \"confidence\": 85,\n");
        prompt.append("  \"notes\": [\"Any clarifications or questions\"]\n");
        prompt.append("}\n");
        prompt.append("Be concise and practical.");

        return prompt.toString();
    }

    /**
     * Parse the model gateway response (streaming JSON) into structured agent specs
     */
    private AgentParseResponse parseResponseIntoAgents(String response) throws Exception {
        // The gateway may return streaming format; extract JSON from response
        String jsonContent = extractJsonFromResponse(response);

        try {
            JsonNode root = objectMapper.readTree(jsonContent);
            return mapJsonToResponse(root);
        } catch (Exception e) {
            // If parsing fails, return a helpful error response
            return createErrorResponse("Failed to parse model response: " + e.getMessage());
        }
    }

    /**
     * Extract JSON from potential streaming response format
     */
    private String extractJsonFromResponse(String response) {
        // Models may wrap response in streaming format
        // Try to extract JSON object from the response
        int jsonStart = response.indexOf('{');
        int jsonEnd = response.lastIndexOf('}');

        if (jsonStart >= 0 && jsonEnd > jsonStart) {
            return response.substring(jsonStart, jsonEnd + 1);
        }

        return response;
    }

    /**
     * Map JSON node to AgentParseResponse
     */
    private AgentParseResponse mapJsonToResponse(JsonNode root) throws Exception {
        AgentParseResponse result = new AgentParseResponse();

        // Summary
        if (root.has("summary")) {
            result.setSummary(root.get("summary").asText());
        }

        // Proposed agents
        if (root.has("proposedAgents")) {
            List<ProposedAgent> agents = new ArrayList<>();
            JsonNode agentsNode = root.get("proposedAgents");
            if (agentsNode.isArray()) {
                for (JsonNode agentNode : agentsNode) {
                    agents.add(mapJsonToAgent(agentNode));
                }
            }
            result.setProposedAgents(agents);
        }

        // Inferred tools
        if (root.has("inferredTools")) {
            List<String> tools = new ArrayList<>();
            JsonNode toolsNode = root.get("inferredTools");
            if (toolsNode.isArray()) {
                for (JsonNode toolNode : toolsNode) {
                    tools.add(toolNode.asText());
                }
            }
            result.setInferredTools(tools);
        }

        // Suggested approval policy
        if (root.has("suggestedApprovalPolicy")) {
            result.setSuggestedApprovalPolicy(root.get("suggestedApprovalPolicy").asText());
        }

        // Suggested collaboration structure
        if (root.has("suggestedCollaborationStructure")) {
            result.setSuggestedCollaborationStructure(root.get("suggestedCollaborationStructure").asText());
        }

        // Confidence
        if (root.has("confidence")) {
            result.setConfidence(root.get("confidence").asInt());
        }

        // Notes
        if (root.has("notes")) {
            List<String> notes = new ArrayList<>();
            JsonNode notesNode = root.get("notes");
            if (notesNode.isArray()) {
                for (JsonNode noteNode : notesNode) {
                    notes.add(noteNode.asText());
                }
            }
            result.setNotes(notes);
        }

        return result;
    }

    /**
     * Map JSON node to ProposedAgent
     */
    private ProposedAgent mapJsonToAgent(JsonNode agentNode) throws Exception {
        ProposedAgent agent = new ProposedAgent();

        if (agentNode.has("name")) agent.setName(agentNode.get("name").asText());
        if (agentNode.has("role")) agent.setRole(agentNode.get("role").asText());
        if (agentNode.has("description")) agent.setDescription(agentNode.get("description").asText());
        if (agentNode.has("personaStyle")) agent.setPersonaStyle(agentNode.get("personaStyle").asText());
        if (agentNode.has("goal")) agent.setGoal(agentNode.get("goal").asText());
        if (agentNode.has("goalCategory")) agent.setGoalCategory(agentNode.get("goalCategory").asText());

        if (agentNode.has("capabilities")) {
            agent.setCapabilities(jsonArrayToList(agentNode.get("capabilities")));
        }
        if (agentNode.has("allowedTools")) {
            agent.setAllowedTools(jsonArrayToList(agentNode.get("allowedTools")));
        }

        if (agentNode.has("approvalPolicy")) agent.setApprovalPolicy(agentNode.get("approvalPolicy").asText());
        if (agentNode.has("workAlone")) agent.setWorkAlone(agentNode.get("workAlone").asBoolean());
        if (agentNode.has("enableMemory")) agent.setEnableMemory(agentNode.get("enableMemory").asBoolean());
        if (agentNode.has("memoryType")) agent.setMemoryType(agentNode.get("memoryType").asText());
        if (agentNode.has("modelPreference")) agent.setModelPreference(agentNode.get("modelPreference").asText());

        return agent;
    }

    /**
     * Convert JSON array to list of strings
     */
    private List<String> jsonArrayToList(JsonNode arrayNode) {
        List<String> result = new ArrayList<>();
        if (arrayNode.isArray()) {
            for (JsonNode item : arrayNode) {
                result.add(item.asText());
            }
        }
        return result;
    }

    /**
     * Create an error response when parsing fails
     */
    private AgentParseResponse createErrorResponse(String errorMessage) {
        AgentParseResponse response = new AgentParseResponse();
        response.setSummary("Could not parse your request");
        response.setProposedAgents(new ArrayList<>());
        response.setInferredTools(new ArrayList<>());
        response.setConfidence(0);
        response.setNotes(List.of(errorMessage));
        return response;
    }
}
