package com.agentplatform.backend.runs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TaskBoardItemRepository extends JpaRepository<TaskBoardItem, String> {
    List<TaskBoardItem> findByRunIdOrderByUpdatedAtDesc(String runId);
    Page<TaskBoardItem> findByRunId(String runId, Pageable pageable);
    List<TaskBoardItem> findByRunIdAndStatus(String runId, String status);
    List<TaskBoardItem> findByRunIdAndPriority(String runId, String priority);
    List<TaskBoardItem> findByCreatedByRunAgentId(String createdByRunAgentId);
    List<TaskBoardItem> findByAssignedToRunAgentId(String assignedToRunAgentId);
    List<TaskBoardItem> findByRunIdAndAssignedToRunAgentId(String runId, String assignedToRunAgentId);
    long countByRunId(String runId);
    long countByRunIdAndStatus(String runId, String status);
}
