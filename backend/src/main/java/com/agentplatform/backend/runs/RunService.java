package com.agentplatform.backend.runs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RunService {

    private final RunRepository runRepository;
    private final RunEventRepository runEventRepository;

    public RunService(RunRepository runRepository, RunEventRepository runEventRepository) {
        this.runRepository = runRepository;
        this.runEventRepository = runEventRepository;
    }

    public RunResponse createRun(Long ownerId, RunRequest request) {
        if (request.getTaskId() == null) {
            throw new IllegalArgumentException("Task ID is required");
        }
        if (request.getAgentId() == null) {
            throw new IllegalArgumentException("Agent ID is required");
        }

        Run run = new Run(request.getTaskId(), request.getAgentId(), ownerId);
        run.setInput(request.getInput());
        if (request.getStatus() != null) {
            run.setStatus(request.getStatus());
        }

        Run saved = runRepository.save(run);
        return new RunResponse(saved);
    }

    public Optional<RunResponse> getRunById(Long id, Long ownerId) {
        return runRepository.findByIdAndOwnerId(id, ownerId)
                .map(RunResponse::new);
    }

    public Page<RunResponse> listRuns(Long ownerId, Pageable pageable) {
        return runRepository.findByOwnerId(ownerId, pageable)
                .map(RunResponse::new);
    }

    public Page<RunResponse> listRunsByStatus(Long ownerId, String status, Pageable pageable) {
        return runRepository.findByOwnerIdAndStatus(ownerId, status, pageable)
                .map(RunResponse::new);
    }

    public Page<RunResponse> listRunsByTask(Long ownerId, Long taskId, Pageable pageable) {
        return runRepository.findByOwnerIdAndTaskId(ownerId, taskId, pageable)
                .map(RunResponse::new);
    }

    public Page<RunResponse> listRunsByAgent(Long ownerId, Long agentId, Pageable pageable) {
        return runRepository.findByOwnerIdAndAgentId(ownerId, agentId, pageable)
                .map(RunResponse::new);
    }

    public RunResponse updateRunStatus(Long id, Long ownerId, String newStatus) {
        Run run = runRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found or not owned by user"));

        run.setStatus(newStatus);
        run.setUpdatedAt(Instant.now());

        Run updated = runRepository.save(run);
        return new RunResponse(updated);
    }

    public RunResponse setRunStarted(Long id, Long ownerId) {
        Run run = runRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found or not owned by user"));

        run.setStatus("running");
        run.setStartedAt(Instant.now());
        run.setUpdatedAt(Instant.now());

        Run updated = runRepository.save(run);
        return new RunResponse(updated);
    }

    public RunResponse completeRun(Long id, Long ownerId, String output, String logs) {
        Run run = runRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found or not owned by user"));

        run.setStatus("completed");
        run.setOutput(output);
        run.setLogs(logs);
        run.setCompletedAt(Instant.now());
        run.setUpdatedAt(Instant.now());

        Run updated = runRepository.save(run);
        return new RunResponse(updated);
    }

    public RunResponse failRun(Long id, Long ownerId, String errorMessage, String logs) {
        Run run = runRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found or not owned by user"));

        run.setStatus("failed");
        run.setErrorMessage(errorMessage);
        run.setLogs(logs);
        run.setCompletedAt(Instant.now());
        run.setUpdatedAt(Instant.now());

        Run updated = runRepository.save(run);
        return new RunResponse(updated);
    }

    public void cancelRun(Long id, Long ownerId) {
        Run run = runRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found or not owned by user"));

        if ("running".equals(run.getStatus())) {
            run.setStatus("cancelled");
            run.setCompletedAt(Instant.now());
            run.setUpdatedAt(Instant.now());
            runRepository.save(run);
        }
    }

    public long countRunsByStatus(Long ownerId, String status) {
        return runRepository.countByOwnerIdAndStatus(ownerId, status);
    }

    public List<RunResponse> getRecentRunsByStatus(Long ownerId, String status, int limit) {
        return runRepository.findByOwnerIdAndStatusOrderByCreatedAtDesc(ownerId, status).stream()
                .limit(limit)
                .map(RunResponse::new)
                .collect(Collectors.toList());
    }

    public RunResponse toResponse(Run run) {
        return new RunResponse(run);
    }

    // ==================== Event Handling ====================

    public RunEvent recordEvent(Long runId, String eventType, String payload) {
        long sequence = runEventRepository.countByRunId(runId);
        RunEvent event = new RunEvent(runId, sequence + 1, eventType, payload);
        return runEventRepository.save(event);
    }

    public List<RunEvent> getRunEvents(Long runId) {
        return runEventRepository.findByRunIdOrderBySequenceAsc(runId);
    }

    public long getEventCount(Long runId) {
        return runEventRepository.countByRunId(runId);
    }
}
