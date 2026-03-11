package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.AgentExecutionRequest;
import com.agentplatform.backend.agents.dto.AgentExecutionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AgentExecutionService {

    private final AgentExecutionRepository execRepo;
    private final AgentRepository agentRepo;

    public AgentExecutionService(AgentExecutionRepository execRepo, AgentRepository agentRepo) {
        this.execRepo = execRepo;
        this.agentRepo = agentRepo;
    }

    /**
     * Start a new execution session for an agent
     */
    public AgentExecutionResponse startExecution(Long agentId, Long ownerId, AgentExecutionRequest req) {
        // Verify agent exists and belongs to owner
        var agent = agentRepo.findById(agentId);
        if (agent.isEmpty() || !agent.get().getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Agent not found or not owned by user");
        }

        var exec = new AgentExecution(agentId, ownerId, req.getInput());
        exec.setReasonId(req.getReasonId());
        exec.setStatus("pending");

        exec = execRepo.save(exec);
        return toResponse(exec);
    }

    /**
     * Get execution by session ID
     */
    public AgentExecutionResponse getExecutionBySessionId(String sessionId) {
        var exec = execRepo.findBySessionId(sessionId);
        if (exec.isEmpty()) {
            throw new IllegalArgumentException("Execution session not found: " + sessionId);
        }
        return toResponse(exec.get());
    }

    /**
     * Get execution by ID for the owner
     */
    public AgentExecutionResponse getExecution(Long executionId, Long ownerId) {
        var exec = execRepo.findById(executionId);
        if (exec.isEmpty() || !exec.get().getOwnerId().equals(ownerId)) {
            return null;
        }
        return toResponse(exec.get());
    }

    /**
     * List executions for an agent
     */
    public List<AgentExecutionResponse> listExecutions(Long agentId, Long ownerId) {
        var executions = execRepo.findByAgentIdAndOwnerIdOrderByCreatedAtDesc(agentId, ownerId);
        return executions.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * List all executions for owner
     */
    public List<AgentExecutionResponse> listAllExecutions(Long ownerId) {
        var executions = execRepo.findByOwnerId(ownerId);
        return executions.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Update execution status
     */
    public AgentExecutionResponse updateExecutionStatus(Long executionId, Long ownerId, String status) {
        var exec = execRepo.findById(executionId);
        if (exec.isEmpty() || !exec.get().getOwnerId().equals(ownerId)) {
            return null;
        }

        var e = exec.get();
        e.setStatus(status);

        if ("running".equals(status) && e.getStartedAt() == null) {
            e.setStartedAt(Instant.now());
        }
        if (("completed".equals(status) || "failed".equals(status)) && e.getCompletedAt() == null) {
            e.setCompletedAt(Instant.now());
        }

        e = execRepo.save(e);
        return toResponse(e);
    }

    /**
     * Complete execution with output
     */
    public AgentExecutionResponse completeExecution(Long executionId, Long ownerId, String output) {
        var exec = execRepo.findById(executionId);
        if (exec.isEmpty() || !exec.get().getOwnerId().equals(ownerId)) {
            return null;
        }

        var e = exec.get();
        e.setOutput(output);
        e.setStatus("completed");
        e.setCompletedAt(Instant.now());

        e = execRepo.save(e);
        return toResponse(e);
    }

    /**
     * Fail execution with error message
     */
    public AgentExecutionResponse failExecution(Long executionId, Long ownerId, String errorMessage) {
        var exec = execRepo.findById(executionId);
        if (exec.isEmpty() || !exec.get().getOwnerId().equals(ownerId)) {
            return null;
        }

        var e = exec.get();
        e.setErrorMessage(errorMessage);
        e.setStatus("failed");
        e.setCompletedAt(Instant.now());

        e = execRepo.save(e);
        return toResponse(e);
    }

    private AgentExecutionResponse toResponse(AgentExecution exec) {
        return new AgentExecutionResponse(
                exec.getId(),
                exec.getAgentId(),
                exec.getSessionId(),
                exec.getStatus(),
                exec.getInput(),
                exec.getOutput(),
                exec.getErrorMessage(),
                exec.getCreatedAt(),
                exec.getStartedAt(),
                exec.getCompletedAt(),
                exec.getReasonId()
        );
    }
}
