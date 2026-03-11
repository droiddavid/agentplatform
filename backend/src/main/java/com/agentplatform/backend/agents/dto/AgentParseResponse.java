package com.agentplatform.backend.agents.dto;

import java.util.List;

public class AgentParseResponse {
    private String summary; // high-level summary of what the system understood
    private List<ProposedAgent> proposedAgents;
    private List<String> inferredTools; // tools that might be useful
    private String suggestedApprovalPolicy; // global approval policy suggestion
    private String suggestedCollaborationStructure; // description of how agents should work together
    private Integer confidence; // 0-100, how confident the parser is
    private List<String> notes; // additional notes or clarifications

    public AgentParseResponse() {}

    public AgentParseResponse(String summary, List<ProposedAgent> proposedAgents) {
        this.summary = summary;
        this.proposedAgents = proposedAgents;
    }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<ProposedAgent> getProposedAgents() { return proposedAgents; }
    public void setProposedAgents(List<ProposedAgent> proposedAgents) { this.proposedAgents = proposedAgents; }

    public List<String> getInferredTools() { return inferredTools; }
    public void setInferredTools(List<String> inferredTools) { this.inferredTools = inferredTools; }

    public String getSuggestedApprovalPolicy() { return suggestedApprovalPolicy; }
    public void setSuggestedApprovalPolicy(String suggestedApprovalPolicy) { this.suggestedApprovalPolicy = suggestedApprovalPolicy; }

    public String getSuggestedCollaborationStructure() { return suggestedCollaborationStructure; }
    public void setSuggestedCollaborationStructure(String suggestedCollaborationStructure) { this.suggestedCollaborationStructure = suggestedCollaborationStructure; }

    public Integer getConfidence() { return confidence; }
    public void setConfidence(Integer confidence) { this.confidence = confidence; }

    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> notes) { this.notes = notes; }
}
