package com.agentplatform.backend.tasks;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AgentTaskService {

    private final AgentTaskRepository agentTaskRepository;

    public AgentTaskService(AgentTaskRepository agentTaskRepository) {
        this.agentTaskRepository = agentTaskRepository;
    }

    /**
     * Assign an agent to a task
     */
    @Transactional
    public AgentTask assignAgentToTask(Long agentId, Long taskId, Long assignedBy) {
        // Check if assignment already exists
        if (agentTaskRepository.existsByAgentIdAndTaskId(agentId, taskId)) {
            throw new IllegalArgumentException("Agent " + agentId + " is already assigned to task " + taskId);
        }

        AgentTask agentTask = new AgentTask(agentId, taskId, assignedBy);
        return agentTaskRepository.save(agentTask);
    }

    /**
     * Unassign an agent from a task
     */
    @Transactional
    public void unassignAgentFromTask(Long agentId, Long taskId) {
        if (!agentTaskRepository.existsByAgentIdAndTaskId(agentId, taskId)) {
            throw new IllegalArgumentException("Agent " + agentId + " is not assigned to task " + taskId);
        }
        agentTaskRepository.deleteByAgentIdAndTaskId(agentId, taskId);
    }

    /**
     * Get all assignments for a task
     */
    public List<AgentTask> getAssignmentsForTask(Long taskId) {
        return agentTaskRepository.findByTaskId(taskId);
    }

    /**
     * Get all agent IDs assigned to a task
     */
    public List<Long> getAgentIdsForTask(Long taskId) {
        return agentTaskRepository.findAgentIdsByTaskId(taskId);
    }

    /**
     * Get all assignments for an agent
     */
    public List<AgentTask> getAssignmentsForAgent(Long agentId) {
        return agentTaskRepository.findByAgentId(agentId);
    }

    /**
     * Get all task IDs assigned to an agent
     */
    public List<Long> getTaskIdsForAgent(Long agentId) {
        return agentTaskRepository.findTaskIdsByAgentId(agentId);
    }

    /**
     * Check if an agent is assigned to a task
     */
    public boolean isAgentAssignedToTask(Long agentId, Long taskId) {
        return agentTaskRepository.existsByAgentIdAndTaskId(agentId, taskId);
    }

    /**
     * Get count of agents assigned to a task
     */
    public long countAgentsForTask(Long taskId) {
        return agentTaskRepository.countByTaskId(taskId);
    }

    /**
     * Get count of tasks assigned to an agent
     */
    public long countTasksForAgent(Long agentId) {
        return agentTaskRepository.countByAgentId(agentId);
    }

    /**
     * Get a specific assignment
     */
    public Optional<AgentTask> getAssignment(Long agentId, Long taskId) {
        return agentTaskRepository.findByAgentIdAndTaskId(agentId, taskId);
    }

    /**
     * Unassign all agents from a task (useful when deleting a task)
     */
    @Transactional
    public void unassignAllAgentsFromTask(Long taskId) {
        agentTaskRepository.deleteInBatch(agentTaskRepository.findByTaskId(taskId));
    }

    /**
     * Unassign an agent from all tasks (useful when deleting an agent)
     */
    @Transactional
    public void unassignAgentFromAllTasks(Long agentId) {
        agentTaskRepository.deleteInBatch(agentTaskRepository.findByAgentId(agentId));
    }
}
