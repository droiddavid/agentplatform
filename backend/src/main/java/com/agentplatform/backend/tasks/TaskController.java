package com.agentplatform.backend.tasks;

import com.agentplatform.backend.auth.jwt.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;
    private final JwtUtil jwtUtil;

    public TaskController(TaskService taskService, JwtUtil jwtUtil) {
        this.taskService = taskService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request, Authentication auth) {
        Long userId = parseUserId(auth);
        TaskResponse response = taskService.createTask(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        return taskService.getTaskById(id, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> listTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskResponse> tasks = taskService.listTasks(userId, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/filter/status")
    public ResponseEntity<Page<TaskResponse>> listTasksByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskResponse> tasks = taskService.listTasksByStatus(userId, status, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/filter/priority")
    public ResponseEntity<Page<TaskResponse>> listTasksByPriority(
            @RequestParam String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskResponse> tasks = taskService.listTasksByPriority(userId, priority, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/filter/category")
    public ResponseEntity<Page<TaskResponse>> listTasksByCategory(
            @RequestParam String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        Long userId = parseUserId(auth);
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskResponse> tasks = taskService.listTasksByCategory(userId, category, pageable);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            TaskResponse response = taskService.updateTask(id, userId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            taskService.deleteTask(id, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<TaskResponse> archiveTask(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            TaskResponse response = taskService.archiveTask(id, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> countTasksByStatus(@RequestParam String status, Authentication auth) {
        Long userId = parseUserId(auth);
        long count = taskService.countTasksByStatus(userId, status);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{taskId}/assign-run/{runId}")
    public ResponseEntity<Void> assignRunToTask(
            @PathVariable Long taskId,
            @PathVariable Long runId,
            Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            taskService.setTaskRunId(taskId, userId, runId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{taskId}/clear-run")
    public ResponseEntity<Void> clearRunFromTask(@PathVariable Long taskId, Authentication auth) {
        Long userId = parseUserId(auth);
        try {
            taskService.clearTaskRunId(taskId, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
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
