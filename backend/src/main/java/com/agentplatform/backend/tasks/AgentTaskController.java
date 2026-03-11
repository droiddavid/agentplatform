package com.agentplatform.backend.tasks;

import com.agentplatform.backend.tasks.dto.AgentTaskRequest;
import com.agentplatform.backend.tasks.dto.AgentTaskResponse;
import com.agentplatform.backend.auth.jwt.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks/agent-assignments")
@CrossOrigin(origins = "*")
public class AgentTaskController {

    private final AgentTaskService agentTaskService;
    private final JwtUtil jwtUtil;

    public AgentTaskController(AgentTaskService agentTaskService, JwtUtil jwtUtil) {
        this.agentTaskService = agentTaskService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Assign an agent to a task
     * POST /api/tasks/agent-assignments
     */
    @PostMapping
    public ResponseEntity<AgentTaskResponse> assignAgent(@RequestBody AgentTaskRequest request, Authentication auth) {
        Long userId = parseUserId(auth);
        AgentTask agentTask = agentTaskService.assignAgentToTask(request.getAgentId(), request.getTaskId(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(agentTask));
    }

    /**
     * Unassign an agent from a task
     * DELETE /api/tasks/agent-assignments/{agentId}/{taskId}
     */
    @DeleteMapping("/{agentId}/{taskId}")
    public ResponseEntity<Void> unassignAgent(@PathVariable Long agentId, @PathVariable Long taskId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        agentTaskService.unassignAgentFromTask(agentId, taskId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all agents assigned to a task
     * GET /api/tasks/{taskId}/agents
     */
    @GetMapping("/task/{taskId}/agents")
    public ResponseEntity<List<AgentTaskResponse>> getAgentsForTask(@PathVariable Long taskId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        List<AgentTask> assignments = agentTaskService.getAssignmentsForTask(taskId);
        List<AgentTaskResponse> responses = assignments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Get all agent IDs assigned to a task
     * GET /api/tasks/{taskId}/agent-ids
     */
    @GetMapping("/task/{taskId}/agent-ids")
    public ResponseEntity<List<Long>> getAgentIdsForTask(@PathVariable Long taskId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        List<Long> agentIds = agentTaskService.getAgentIdsForTask(taskId);
        return ResponseEntity.ok(agentIds);
    }

    /**
     * Get all tasks assigned to an agent
     * GET /api/tasks/agent/{agentId}/tasks
     */
    @GetMapping("/agent/{agentId}/tasks")
    public ResponseEntity<List<AgentTaskResponse>> getTasksForAgent(@PathVariable Long agentId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        List<AgentTask> assignments = agentTaskService.getAssignmentsForAgent(agentId);
        List<AgentTaskResponse> responses = assignments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Get all task IDs assigned to an agent
     * GET /api/tasks/agent/{agentId}/task-ids
     */
    @GetMapping("/agent/{agentId}/task-ids")
    public ResponseEntity<List<Long>> getTaskIdsForAgent(@PathVariable Long agentId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        List<Long> taskIds = agentTaskService.getTaskIdsForAgent(agentId);
        return ResponseEntity.ok(taskIds);
    }

    /**
     * Check if an agent is assigned to a task
     * GET /api/tasks/{agentId}/{taskId}/assigned
     */
    @GetMapping("/{agentId}/{taskId}/assigned")
    public ResponseEntity<Boolean> isAssigned(@PathVariable Long agentId, @PathVariable Long taskId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        boolean assigned = agentTaskService.isAgentAssignedToTask(agentId, taskId);
        return ResponseEntity.ok(assigned);
    }

    /**
     * Get count of agents assigned to a task
     * GET /api/tasks/{taskId}/agent-count
     */
    @GetMapping("/task/{taskId}/agent-count")
    public ResponseEntity<Long> countAgentsForTask(@PathVariable Long taskId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        long count = agentTaskService.countAgentsForTask(taskId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get count of tasks assigned to an agent
     * GET /api/tasks/agent/{agentId}/task-count
     */
    @GetMapping("/agent/{agentId}/task-count")
    public ResponseEntity<Long> countTasksForAgent(@PathVariable Long agentId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        long count = agentTaskService.countTasksForAgent(agentId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get a specific assignment
     * GET /api/tasks/agent-assignments/{agentId}/{taskId}
     */
    @GetMapping("/{agentId}/{taskId}")
    public ResponseEntity<AgentTaskResponse> getAssignment(@PathVariable Long agentId, @PathVariable Long taskId, Authentication auth) {
        parseUserId(auth); // Verify authentication
        return agentTaskService.getAssignment(agentId, taskId)
                .map(agentTask -> ResponseEntity.ok(toResponse(agentTask)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Helper method to convert entity to response DTO
     */
    private AgentTaskResponse toResponse(AgentTask agentTask) {
        return new AgentTaskResponse(
                agentTask.getId(),
                agentTask.getAgentId(),
                agentTask.getTaskId(),
                agentTask.getAssignedAt(),
                agentTask.getAssignedBy()
        );
    }

    /**
     * Parse user ID from JWT token
     */
    private Long parseUserId(Authentication auth) {
        if (auth == null) {
            throw new IllegalArgumentException("Authentication required");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof String) {
            // Extract user ID from JWT token
            try {
                String token = (String) principal;
                return jwtUtil.parseUserIdFromToken(token);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid authentication token");
            }
        }
        throw new IllegalArgumentException("Invalid authentication");
    }
}
