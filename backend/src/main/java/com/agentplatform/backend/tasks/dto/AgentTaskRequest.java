package com.agentplatform.backend.tasks.dto;

public class AgentTaskRequest {
    private Long agentId;
    private Long taskId;

    public AgentTaskRequest() {}

    public AgentTaskRequest(Long agentId, Long taskId) {
        this.agentId = agentId;
        this.taskId = taskId;
    }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
}
