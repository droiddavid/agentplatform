package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.*;
import com.agentplatform.backend.auth.jwt.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.Map;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;
    private final AgentExecutionService executionService;
    private final AgentParserService parserService;
    private final JwtUtil jwtUtil;

    public AgentController(AgentService agentService, AgentExecutionService executionService, AgentParserService parserService, JwtUtil jwtUtil) {
        this.agentService = agentService;
        this.executionService = executionService;
        this.parserService = parserService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<AgentResponse> create(@RequestBody AgentCreateRequest req, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = agentService.createAgent(userId, req);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<AgentResponse>> list(Authentication auth) {
        Long userId = parseUserId(auth);
        return ResponseEntity.ok(agentService.listByOwner(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = agentService.getByIdForOwner(userId, id);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        agentService.deleteByIdForOwner(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AgentCreateRequest req, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = agentService.updateAgent(userId, id, req);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    // ==================== Capability Endpoints ====================

    @PostMapping("/{agentId}/capabilities")
    public ResponseEntity<?> addCapability(@PathVariable Long agentId, 
                                          @RequestBody Map<String, String> body, 
                                          Authentication auth) {
        Long userId = parseUserId(auth);
        String name = body.get("capabilityName");
        String description = body.get("description");
        if (name == null) return ResponseEntity.badRequest().build();
        var res = agentService.addCapability(userId, agentId, name, description);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{agentId}/capabilities")
    public ResponseEntity<?> listCapabilities(@PathVariable Long agentId, Authentication auth) {
        Long userId = parseUserId(auth);
        return ResponseEntity.ok(agentService.listCapabilities(userId, agentId));
    }

    @DeleteMapping("/{agentId}/capabilities/{capabilityId}")
    public ResponseEntity<?> removeCapability(@PathVariable Long agentId, @PathVariable Long capabilityId, Authentication auth) {
        Long userId = parseUserId(auth);
        agentService.removeCapability(userId, agentId, capabilityId);
        return ResponseEntity.noContent().build();
    }

    // ==================== Tool Permission Endpoints ====================

    @PostMapping("/{agentId}/tool-permissions")
    public ResponseEntity<?> addToolPermission(@PathVariable Long agentId,
                                              @RequestBody Map<String, Object> body,
                                              Authentication auth) {
        Long userId = parseUserId(auth);
        String toolName = (String) body.get("toolName");
        String permLevel = (String) body.getOrDefault("permissionLevel", "execute");
        Boolean requiresApproval = (Boolean) body.getOrDefault("requiresApproval", false);
        if (toolName == null) return ResponseEntity.badRequest().build();
        var res = agentService.addToolPermission(userId, agentId, toolName, permLevel, requiresApproval);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{agentId}/tool-permissions")
    public ResponseEntity<?> listToolPermissions(@PathVariable Long agentId, Authentication auth) {
        Long userId = parseUserId(auth);
        return ResponseEntity.ok(agentService.listToolPermissions(userId, agentId));
    }

    // ==================== Policy Endpoints ====================

    @PostMapping("/{agentId}/policies")
    public ResponseEntity<?> addPolicy(@PathVariable Long agentId,
                                      @RequestBody Map<String, String> body,
                                      Authentication auth) {
        Long userId = parseUserId(auth);
        String policyName = body.get("policyName");
        String policyValue = body.get("policyValue");
        if (policyName == null || policyValue == null) return ResponseEntity.badRequest().build();
        var res = agentService.addPolicy(userId, agentId, policyName, policyValue);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{agentId}/policies")
    public ResponseEntity<?> listPolicies(@PathVariable Long agentId, Authentication auth) {
        Long userId = parseUserId(auth);
        return ResponseEntity.ok(agentService.listPolicies(userId, agentId));
    }
    // ==================== Parser Endpoints ====================

    /**
     * Parse natural language description into proposed agent specifications
     */
    @PostMapping("/parse")
    public ResponseEntity<?> parseDescription(@RequestBody AgentParseRequest req, Authentication auth) {
        if (auth == null) throw new IllegalStateException("Not authenticated");
        try {
            var res = parserService.parseAgentDescription(req);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Parser error: " + e.getMessage()
            ));
        }
    }

    /**
     * Validate wizard payload before agent creation
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateWizardPayload(@RequestBody AgentCreateRequest req, Authentication auth) {
        if (auth == null) throw new IllegalStateException("Not authenticated");
        
        var errors = new java.util.ArrayList<String>();
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            errors.add("Agent name is required");
        }
        if (req.getName() != null && req.getName().length() > 255) {
            errors.add("Agent name must be less than 255 characters");
        }
        
        if (!errors.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of(
                    "valid", false,
                    "errors", errors
            ));
        }
        
        return ResponseEntity.ok(Map.of("valid", true));
    }
    
    // ==================== Execution Endpoints ====================

    /**
     * Start a new execution session for an agent
     */
    @PostMapping("/{agentId}/executions")
    public ResponseEntity<?> startExecution(@PathVariable Long agentId, @RequestBody AgentExecutionRequest req, Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            var res = executionService.startExecution(agentId, userId, req);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * Get execution status by session ID
     */
    @GetMapping("/executions/session/{sessionId}")
    public ResponseEntity<?> getExecutionBySession(@PathVariable String sessionId) {
        try {
            var res = executionService.getExecutionBySessionId(sessionId);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * Get execution details by execution ID
     */
    @GetMapping("/{agentId}/executions/{executionId}")
    public ResponseEntity<?> getExecution(@PathVariable Long agentId, @PathVariable Long executionId, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = executionService.getExecution(executionId, userId);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    /**
     * List all executions for a specific agent
     */
    @GetMapping("/{agentId}/executions")
    public ResponseEntity<?> listExecutions(@PathVariable Long agentId, Authentication auth) {
        Long userId = parseUserId(auth);
        // Verify agent exists and belongs to owner
        var agent = agentService.getByIdForOwner(userId, agentId);
        if (agent == null) return ResponseEntity.status(404).build();
        
        var res = executionService.listExecutions(agentId, userId);
        return ResponseEntity.ok(res);
    }

    /**
     * List all executions across all agents for current user
     */
    @GetMapping("/executions/all")
    public ResponseEntity<?> listAllExecutions(Authentication auth) {
        Long userId = parseUserId(auth);
        var res = executionService.listAllExecutions(userId);
        return ResponseEntity.ok(res);
    }

    /**
     * Update execution status
     */
    @PatchMapping("/{agentId}/executions/{executionId}/status")
    public ResponseEntity<?> updateExecutionStatus(@PathVariable Long agentId, @PathVariable Long executionId,
                                                    @RequestParam String status, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = executionService.updateExecutionStatus(executionId, userId, status);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    /**
     * Complete execution with output
     */
    @PatchMapping("/{agentId}/executions/{executionId}/complete")
    public ResponseEntity<?> completeExecution(@PathVariable Long agentId, @PathVariable Long executionId,
                                               @RequestParam String output, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = executionService.completeExecution(executionId, userId, output);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    /**
     * Fail execution with error message
     */
    @PatchMapping("/{agentId}/executions/{executionId}/fail")
    public ResponseEntity<?> failExecution(@PathVariable Long agentId, @PathVariable Long executionId,
                                          @RequestParam String errorMessage, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = executionService.failExecution(executionId, userId, errorMessage);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
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
        throw new IllegalStateException("Unable to determine current user id");
    }
}
