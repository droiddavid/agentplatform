package com.agentplatform.backend.runs;

import com.agentplatform.backend.auth.jwt.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/runs")
@CrossOrigin(origins = "*")
public class RunController {

    private final RunService runService;
    private final JwtUtil jwtUtil;

    public RunController(RunService runService, JwtUtil jwtUtil) {
        this.runService = runService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<RunResponse> createRun(@RequestBody RunRequest request, Authentication auth) {
        Long userId = parseUserId(auth);
        RunResponse response = runService.createRun(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RunResponse> getRun(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        return runService.getRunById(id, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<RunResponse>> listRuns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<RunResponse> runs = runService.listRuns(userId, pageable);
        return ResponseEntity.ok(runs);
    }

    @GetMapping("/filter/status")
    public ResponseEntity<Page<RunResponse>> listRunsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<RunResponse> runs = runService.listRunsByStatus(userId, status, pageable);
        return ResponseEntity.ok(runs);
    }

    @GetMapping("/filter/task/{taskId}")
    public ResponseEntity<Page<RunResponse>> listRunsByTask(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<RunResponse> runs = runService.listRunsByTask(userId, taskId, pageable);
        return ResponseEntity.ok(runs);
    }

    @GetMapping("/filter/agent/{agentId}")
    public ResponseEntity<Page<RunResponse>> listRunsByAgent(
            @PathVariable Long agentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<RunResponse> runs = runService.listRunsByAgent(userId, agentId, pageable);
        return ResponseEntity.ok(runs);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RunResponse> updateRunStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            RunResponse response = runService.updateRunStatus(id, userId, status);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<RunResponse> startRun(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            RunResponse response = runService.setRunStarted(id, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<RunResponse> completeRun(
            @PathVariable Long id,
            @RequestParam(required = false) String output,
            @RequestParam(required = false) String logs,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            RunResponse response = runService.completeRun(id, userId, output, logs);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/fail")
    public ResponseEntity<RunResponse> failRun(
            @PathVariable Long id,
            @RequestParam(required = false) String errorMessage,
            @RequestParam(required = false) String logs,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            RunResponse response = runService.failRun(id, userId, errorMessage, logs);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelRun(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            runService.cancelRun(id, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> countRunsByStatus(@RequestParam String status, Authentication auth) {
        Long userId = parseUserId(auth);
        long count = runService.countRunsByStatus(userId, status);
        return ResponseEntity.ok(count);
    }

    // ==================== Event Endpoints ====================

    @PostMapping("/{runId}/events")
    public ResponseEntity<?> recordEvent(@PathVariable Long runId, @RequestBody java.util.Map<String, String> payload, Authentication auth) {
        parseUserId(auth);
        try {
            RunEvent event = runService.recordEvent(runId, payload.get("eventType"), payload.get("payload"));
            return ResponseEntity.status(HttpStatus.CREATED).body(event);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{runId}/events")
    public ResponseEntity<java.util.List<RunEvent>> getRunEvents(@PathVariable Long runId, Authentication auth) {
        parseUserId(auth);
        java.util.List<RunEvent> events = runService.getRunEvents(runId);
        return ResponseEntity.ok(events);
    }

    private Long parseUserId(Authentication auth) {
        if (auth == null) throw new IllegalStateException("Not authenticated");
        try {
            var principal = auth.getPrincipal();
            if (principal instanceof String) {
                String p = (String) principal;
                try { return Long.parseLong(p); } catch (Exception e) { return jwtUtil.parseUserIdFromToken((String)auth.getDetails()); }
            }
        } catch (Exception e) {}
        throw new IllegalStateException("Unable to determine current user id");
    }
}
