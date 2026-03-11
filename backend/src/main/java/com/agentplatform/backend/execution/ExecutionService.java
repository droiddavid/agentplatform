package com.agentplatform.backend.execution;

import com.agentplatform.backend.agents.Agent;
import com.agentplatform.backend.agents.AgentRepository;
import com.agentplatform.backend.runs.Run;
import com.agentplatform.backend.runs.RunRepository;
import com.agentplatform.backend.tasks.AgentTask;
import com.agentplatform.backend.tasks.AgentTaskRepository;
import com.agentplatform.backend.tasks.Task;
import com.agentplatform.backend.tasks.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExecutionService {

    private final TaskRepository taskRepository;
    private final AgentRepository agentRepository;
    private final AgentTaskRepository agentTaskRepository;
    private final RunRepository runRepository;

    public ExecutionService(
            TaskRepository taskRepository,
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            RunRepository runRepository) {
        this.taskRepository = taskRepository;
        this.agentRepository = agentRepository;
        this.agentTaskRepository = agentTaskRepository;
        this.runRepository = runRepository;
    }

    /**
     * Find all agents assigned to a task
     */
    public List<AgentTask> findAgentsForTask(Long taskId) {
        return agentTaskRepository.findByTaskId(taskId);
    }

    /**
     * Find the primary/first assigned agent for a task
     */
    public Optional<Agent> findPrimaryAgentForTask(Long taskId) {
        List<AgentTask> assignments = agentTaskRepository.findByTaskId(taskId);
        if (assignments.isEmpty()) {
            return Optional.empty();
        }
        // Get first assigned agent (could be enhanced with priority logic)
        Long agentId = assignments.get(0).getAgentId();
        return agentRepository.findById(agentId);
    }

    /**
     * Execute a task with a specific agent
     */
    public Run executeTask(Long taskId, Long agentId, String input, Long ownerId) {
        // Verify task exists and is owned by the user
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!task.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized: task not owned by user");
        }

        // Verify agent exists and is owned by the user
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found"));
        if (!agent.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized: agent not owned by user");
        }

        // Verify agent is assigned to task
        AgentTask assignment = agentTaskRepository.findByAgentIdAndTaskId(agentId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not assigned to task"));

        // Create Run record
        Run run = new Run();
        run.setOwnerId(ownerId);
        run.setTaskId(taskId);
        run.setAgentId(agentId);
        run.setStatus("pending");
        run.setInput(input);
        run.setStartedAt(Instant.now());

        Run savedRun = runRepository.save(run);

        // Update task status and track current run
        task.setStatus("running");
        task.setCurrentRunId(savedRun.getId());
        taskRepository.save(task);

        // Simulate/Initialize agent execution
        initializeExecution(savedRun, agent, task);

        return savedRun;
    }

    /**
     * Execute with the primary assigned agent
     */
    public Run executeTaskWithPrimaryAgent(Long taskId, String input, Long ownerId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        Agent agent = findPrimaryAgentForTask(taskId)
                .orElseThrow(() -> new IllegalArgumentException("No agent assigned to task"));

        return executeTask(taskId, agent.getId(), input, ownerId);
    }

    /**
     * Initialize execution - this is where agent logic would be triggered
     * In a real system, this might queue a message, call an external service, etc.
     */
    private void initializeExecution(Run run, Agent agent, Task task) {
        // For now, simulate execution by transitioning to RUNNING
        run.setStatus("running");
        runRepository.save(run);

        // In a production system, this would:
        // 1. Queue a job for the agent to process
        // 2. Call an agent microservice
        // 3. Trigger a Lambda/serverless function
        // 4. Send a message to a message queue
        // etc.
    }

    /**
     * Complete an execution with output
     */
    public Run completeExecution(Long runId, String output, Long ownerId) {
        Run run = runRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found"));

        if (!run.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized: run not owned by user");
        }

        run.setStatus("completed");
        run.setOutput(output);
        run.setCompletedAt(Instant.now());
        Run savedRun = runRepository.save(run);

        // Update task as completed
        Task task = taskRepository.findById(run.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        task.setStatus("completed");
        taskRepository.save(task);

        return savedRun;
    }

    /**
     * Fail an execution with error message
     */
    public Run failExecution(Long runId, String errorMessage, Long ownerId) {
        Run run = runRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found"));

        if (!run.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized: run not owned by user");
        }

        run.setStatus("failed");
        run.setErrorMessage(errorMessage);
        run.setCompletedAt(Instant.now());
        Run savedRun = runRepository.save(run);

        // Update task as failed
        Task task = taskRepository.findById(run.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        task.setStatus("ready"); // Reset to ready so it can be retried
        taskRepository.save(task);

        return savedRun;
    }

    /**
     * Get execution history for a task
     */
    public List<Run> getTaskExecutionHistory(Long taskId, Long ownerId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized: task not owned by user");
        }

        return runRepository.findByTaskId(taskId);
    }
}
