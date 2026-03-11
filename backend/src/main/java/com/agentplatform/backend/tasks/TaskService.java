package com.agentplatform.backend.tasks;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponse createTask(Long ownerId, TaskRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task title is required");
        }
        if (request.getCategory() == null || request.getCategory().isBlank()) {
            throw new IllegalArgumentException("Task category is required");
        }

        Task task = new Task(ownerId, request.getTitle(), request.getCategory());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueAt(request.getDueAt());

        Task saved = taskRepository.save(task);
        return new TaskResponse(saved);
    }

    public Optional<TaskResponse> getTaskById(Long id, Long ownerId) {
        return taskRepository.findByIdAndOwnerId(id, ownerId)
                .map(TaskResponse::new);
    }

    public Page<TaskResponse> listTasks(Long ownerId, Pageable pageable) {
        return taskRepository.findByOwnerIdAndArchivedFalse(ownerId, pageable)
                .map(TaskResponse::new);
    }

    public Page<TaskResponse> listTasksByStatus(Long ownerId, String status, Pageable pageable) {
        return taskRepository.findByOwnerIdAndStatusAndArchivedFalse(ownerId, status, pageable)
                .map(TaskResponse::new);
    }

    public Page<TaskResponse> listTasksByPriority(Long ownerId, String priority, Pageable pageable) {
        return taskRepository.findByOwnerIdAndPriorityAndArchivedFalse(ownerId, priority, pageable)
                .map(TaskResponse::new);
    }

    public Page<TaskResponse> listTasksByCategory(Long ownerId, String category, Pageable pageable) {
        return taskRepository.findByOwnerIdAndCategoryAndArchivedFalse(ownerId, category, pageable)
                .map(TaskResponse::new);
    }

    public TaskResponse updateTask(Long id, Long ownerId, TaskRequest request) {
        Task task = taskRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or not owned by user"));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            task.setCategory(request.getCategory());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            task.setPriority(request.getPriority());
        }
        task.setDueAt(request.getDueAt());
        task.setUpdatedAt(Instant.now());

        Task updated = taskRepository.save(task);
        return new TaskResponse(updated);
    }

    public void deleteTask(Long id, Long ownerId) {
        Task task = taskRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or not owned by user"));

        taskRepository.delete(task);
    }

    public TaskResponse archiveTask(Long id, Long ownerId) {
        Task task = taskRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or not owned by user"));

        task.setArchived(true);
        task.setUpdatedAt(Instant.now());
        Task updated = taskRepository.save(task);
        return new TaskResponse(updated);
    }

    public long countTasksByStatus(Long ownerId, String status) {
        return taskRepository.countByOwnerIdAndStatusAndArchivedFalse(ownerId, status);
    }

    public void setTaskRunId(Long taskId, Long ownerId, Long runId) {
        Task task = taskRepository.findByIdAndOwnerId(taskId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or not owned by user"));

        task.setCurrentRunId(runId);
        task.setUpdatedAt(Instant.now());
        taskRepository.save(task);
    }

    public void clearTaskRunId(Long taskId, Long ownerId) {
        Task task = taskRepository.findByIdAndOwnerId(taskId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or not owned by user"));

        task.setCurrentRunId(null);
        task.setUpdatedAt(Instant.now());
        taskRepository.save(task);
    }
}
