package com.agentplatform.backend.runs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/runs/{runId}/board-items")
@CrossOrigin(origins = "*")
public class TaskBoardItemController {
    @Autowired
    private TaskBoardItemService taskBoardItemService;

    @PostMapping
    public ResponseEntity<TaskBoardItemResponse> createTaskBoardItem(@PathVariable String runId, @RequestBody TaskBoardItemRequest request) {
        request.setRunId(runId);
        TaskBoardItemResponse response = taskBoardItemService.createTaskBoardItem(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskBoardItemResponse>> getTaskBoardItems(@PathVariable String runId) {
        List<TaskBoardItemResponse> items = taskBoardItemService.getRunTaskBoardItems(runId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<TaskBoardItemResponse>> getTaskBoardItemsPaginated(
            @PathVariable String runId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TaskBoardItemResponse> items = taskBoardItemService.getRunTaskBoardItemsPaginated(runId, page, size);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<TaskBoardItemResponse> getTaskBoardItem(@PathVariable String runId, @PathVariable String itemId) {
        TaskBoardItemResponse item = taskBoardItemService.getTaskBoardItemById(itemId);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskBoardItemResponse>> getTaskBoardItemsByStatus(@PathVariable String runId, @PathVariable String status) {
        List<TaskBoardItemResponse> items = taskBoardItemService.getTaskBoardItemsByStatus(runId, status);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TaskBoardItemResponse>> getTaskBoardItemsByPriority(@PathVariable String runId, @PathVariable String priority) {
        List<TaskBoardItemResponse> items = taskBoardItemService.getTaskBoardItemsByPriority(runId, priority);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/assigned-to/{agentId}")
    public ResponseEntity<List<TaskBoardItemResponse>> getTaskBoardItemsAssignedTo(@PathVariable String runId, @PathVariable String agentId) {
        List<TaskBoardItemResponse> items = taskBoardItemService.getTaskBoardItemsAssignedTo(runId, agentId);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<TaskBoardItemResponse> updateTaskBoardItem(@PathVariable String runId, @PathVariable String itemId, @RequestBody TaskBoardItemRequest request) {
        TaskBoardItemResponse item = taskBoardItemService.updateTaskBoardItem(itemId, request);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{itemId}/complete")
    public ResponseEntity<TaskBoardItemResponse> markAsCompleted(@PathVariable String runId, @PathVariable String itemId) {
        TaskBoardItemResponse item = taskBoardItemService.markAsCompleted(itemId);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteTaskBoardItem(@PathVariable String runId, @PathVariable String itemId) {
        taskBoardItemService.deleteTaskBoardItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> getTaskBoardItemCount(@PathVariable String runId) {
        long count = taskBoardItemService.getTaskBoardItemCount(runId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> getTaskBoardItemCountByStatus(@PathVariable String runId, @PathVariable String status) {
        long count = taskBoardItemService.getTaskBoardItemCountByStatus(runId, status);
        return ResponseEntity.ok(count);
    }
}
