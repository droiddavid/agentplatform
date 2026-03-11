package com.agentplatform.backend.runs;

public class RunRequest {
    private Long taskId;
    private Long agentId;
    private String input; // JSON string
    private String status;

    public RunRequest() {}

    public RunRequest(Long taskId, Long agentId, String input) {
        this.taskId = taskId;
        this.agentId = agentId;
        this.input = input;
    }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
