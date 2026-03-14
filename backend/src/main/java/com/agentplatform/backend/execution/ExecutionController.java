package com.agentplatform.backend.execution;

import com.agentplatform.backend.auth.jwt.JwtUtil;
import com.agentplatform.backend.runs.RunResponse;
import com.agentplatform.backend.runs.RunService;
import com.agentplatform.backend.tasks.dto.AgentTaskResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/executions")
public class ExecutionController {

    private final ExecutionService executionService;
    private final RunService runService;
    private final JwtUtil jwtUtil;

    public ExecutionController(ExecutionService executionService, RunService runService, JwtUtil jwtUtil) {
        this.executionService = executionService;
        this.runService = runService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Get agents assigned to a task
     * GET /api/executions/task/{taskId}/agents
     */
    @GetMapping("/task/{taskId}/agents")
    public ResponseEntity<List<AgentTaskResponse>> getAgentsForTask(
            @PathVariable Long taskId,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            List<AgentTaskResponse> agents = executionService.findAgentsForTask(taskId)
                    .stream()
                    .map(at -> new AgentTaskResponse(
                            at.getId(),
                            at.getAgentId(),
                            at.getTaskId(),
                            at.getAssignedAt(),
                            at.getAssignedBy()))
                    .toList();
            return ResponseEntity.ok(agents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Execute a task with a specific agent
     * POST /api/executions/task/{taskId}/agent/{agentId}
     * Body: { "input": "..." }
     */
    @PostMapping("/task/{taskId}/agent/{agentId}")
    public ResponseEntity<RunResponse> executeTaskWithAgent(
            @PathVariable Long taskId,
            @PathVariable Long agentId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            String input = body.getOrDefault("input", "");
            var run = executionService.executeTask(taskId, agentId, input, userId);
            RunResponse response = runService.toResponse(run);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Execute a task with the primary assigned agent
     * POST /api/executions/task/{taskId}/execute
     * Body: { "input": "..." }
     */
    @PostMapping("/task/{taskId}/execute")
    public ResponseEntity<RunResponse> executeTask(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            String input = body.getOrDefault("input", "");
            var run = executionService.executeTaskWithPrimaryAgent(taskId, input, userId);
            RunResponse response = runService.toResponse(run);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get execution history for a task
     * GET /api/executions/task/{taskId}/history
     */
    @GetMapping("/task/{taskId}/history")
    public ResponseEntity<List<RunResponse>> getTaskExecutionHistory(
            @PathVariable Long taskId,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            List<RunResponse> runs = executionService.getTaskExecutionHistory(taskId, userId)
                    .stream()
                    .map(runService::toResponse)
                    .toList();
            return ResponseEntity.ok(runs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Complete an execution with output
     * PATCH /api/executions/{runId}/complete
     * Body: { "output": "..." }
     */
    @PatchMapping("/{runId}/complete")
    public ResponseEntity<RunResponse> completeExecution(
            @PathVariable Long runId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            String output = body.getOrDefault("output", "");
            var run = executionService.completeExecution(runId, output, userId);
            RunResponse response = runService.toResponse(run);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Fail an execution with error
     * PATCH /api/executions/{runId}/fail
     * Body: { "errorMessage": "..." }
     */
    @PatchMapping("/{runId}/fail")
    public ResponseEntity<RunResponse> failExecution(
            @PathVariable Long runId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            String errorMessage = body.getOrDefault("errorMessage", "Unknown error");
            var run = executionService.failExecution(runId, errorMessage, userId);
            RunResponse response = runService.toResponse(run);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private Long parseUserId(Authentication auth) {
        if (auth == null) throw new IllegalStateException("Not authenticated");
        try {
            // authentication principal may be email or id string
            var principal = auth.getPrincipal();
            if (principal instanceof String) {
                String p = (String) principal;
                // try parse long, otherwise lookup user by email would be needed; jwt filter sets email or id
                try { return Long.parseLong(p); } catch (Exception e) { return jwtUtil.parseUserIdFromToken((String)auth.getDetails()); }
            }
        } catch (Exception e) {}
        throw new IllegalStateException("Cannot parse user ID from authentication");
    }
}
