package com.agentplatform.backend.runs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskBoardItemService {
    @Autowired
    private TaskBoardItemRepository taskBoardItemRepository;

    public TaskBoardItemResponse createTaskBoardItem(TaskBoardItemRequest request) {
        TaskBoardItem item = new TaskBoardItem(
            UUID.randomUUID().toString().substring(0, 26),
            request.getRunId(),
            request.getCreatedByRunAgentId(),
            request.getTitle(),
            request.getDescription(),
            request.getStatus(),
            request.getPriority());

        if (request.getAssignedToRunAgentId() != null) {
            item.setAssignedToRunAgentId(request.getAssignedToRunAgentId());
        }

        TaskBoardItem saved = taskBoardItemRepository.save(item);
        return new TaskBoardItemResponse(saved);
    }

    public TaskBoardItemResponse getTaskBoardItemById(String id) {
        Optional<TaskBoardItem> item = taskBoardItemRepository.findById(id);
        return item.map(TaskBoardItemResponse::new).orElse(null);
    }

    public List<TaskBoardItemResponse> getRunTaskBoardItems(String runId) {
        List<TaskBoardItem> items = taskBoardItemRepository.findByRunIdOrderByUpdatedAtDesc(runId);
        return items.stream().map(TaskBoardItemResponse::new).toList();
    }

    public Page<TaskBoardItemResponse> getRunTaskBoardItemsPaginated(String runId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskBoardItem> items = taskBoardItemRepository.findByRunId(runId, pageable);
        return items.map(TaskBoardItemResponse::new);
    }

    public List<TaskBoardItemResponse> getTaskBoardItemsByStatus(String runId, String status) {
        List<TaskBoardItem> items = taskBoardItemRepository.findByRunIdAndStatus(runId, status);
        return items.stream().map(TaskBoardItemResponse::new).toList();
    }

    public List<TaskBoardItemResponse> getTaskBoardItemsByPriority(String runId, String priority) {
        List<TaskBoardItem> items = taskBoardItemRepository.findByRunIdAndPriority(runId, priority);
        return items.stream().map(TaskBoardItemResponse::new).toList();
    }

    public List<TaskBoardItemResponse> getTaskBoardItemsAssignedTo(String runId, String assignedToRunAgentId) {
        List<TaskBoardItem> items = taskBoardItemRepository.findByRunIdAndAssignedToRunAgentId(runId, assignedToRunAgentId);
        return items.stream().map(TaskBoardItemResponse::new).toList();
    }

    public TaskBoardItemResponse updateTaskBoardItem(String id, TaskBoardItemRequest request) {
        Optional<TaskBoardItem> existing = taskBoardItemRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        TaskBoardItem item = existing.get();
        if (request.getTitle() != null) {
            item.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            item.setPriority(request.getPriority());
        }
        if (request.getAssignedToRunAgentId() != null) {
            item.setAssignedToRunAgentId(request.getAssignedToRunAgentId());
        }
        item.setUpdatedAt(Instant.now());

        TaskBoardItem updated = taskBoardItemRepository.save(item);
        return new TaskBoardItemResponse(updated);
    }

    public TaskBoardItemResponse markAsCompleted(String id) {
        Optional<TaskBoardItem> existing = taskBoardItemRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        TaskBoardItem item = existing.get();
        item.setStatus("completed");
        item.setCompletedAt(Instant.now());
        item.setUpdatedAt(Instant.now());

        TaskBoardItem updated = taskBoardItemRepository.save(item);
        return new TaskBoardItemResponse(updated);
    }

    public void deleteTaskBoardItem(String id) {
        taskBoardItemRepository.deleteById(id);
    }

    public long getTaskBoardItemCount(String runId) {
        return taskBoardItemRepository.countByRunId(runId);
    }

    public long getTaskBoardItemCountByStatus(String runId, String status) {
        return taskBoardItemRepository.countByRunIdAndStatus(runId, status);
    }
}
