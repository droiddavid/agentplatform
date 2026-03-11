package com.agentplatform.backend.tasks;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentTaskRepository extends JpaRepository<AgentTask, Long> {

    // Find all associations for a specific task
    List<AgentTask> findByTaskId(Long taskId);

    // Find all associations for a specific agent
    List<AgentTask> findByAgentId(Long agentId);

    // Check if a specific agent is assigned to a task
    boolean existsByAgentIdAndTaskId(Long agentId, Long taskId);

    // Find specific association
    Optional<AgentTask> findByAgentIdAndTaskId(Long agentId, Long taskId);

    // Count how many agents are assigned to a task
    long countByTaskId(Long taskId);

    // Count how many tasks an agent is assigned to
    long countByAgentId(Long agentId);

    // Delete specific association
    void deleteByAgentIdAndTaskId(Long agentId, Long taskId);

    // Get all agent IDs for a specific task
    @Query("SELECT ata.agentId FROM AgentTask ata WHERE ata.taskId = :taskId ORDER BY ata.assignedAt DESC")
    List<Long> findAgentIdsByTaskId(@Param("taskId") Long taskId);

    // Get all task IDs for a specific agent
    @Query("SELECT ata.taskId FROM AgentTask ata WHERE ata.agentId = :agentId ORDER BY ata.assignedAt DESC")
    List<Long> findTaskIdsByAgentId(@Param("agentId") Long agentId);
}
