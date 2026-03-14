package com.agentplatform.backend.execution;

import com.agentplatform.backend.agents.Agent;
import com.agentplatform.backend.agents.AgentRepository;
import com.agentplatform.backend.models.provider.ModelProviderRequest;
import com.agentplatform.backend.models.provider.ModelProviderResponse;
import com.agentplatform.backend.models.provider.ModelGatewayService;
import com.agentplatform.backend.runs.*;
import com.agentplatform.backend.tasks.Task;
import com.agentplatform.backend.tasks.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Core execution engine service that orchestrates a single agent turn.
 * Manages the execution lifecycle, state transitions, model interaction, and event publishing.
 */
@Service
public class ExecutionEngineService {

  private static final Logger logger = LoggerFactory.getLogger(ExecutionEngineService.class);

  private final RunRepository runRepository;
  private final RunService runService;
  private final AgentRepository agentRepository;
  private final TaskRepository taskRepository;
  private final ModelGatewayService modelGatewayService;
  private final ApplicationEventPublisher eventPublisher;

  public ExecutionEngineService(
      RunRepository runRepository,
      RunService runService,
      AgentRepository agentRepository,
      TaskRepository taskRepository,
      ModelGatewayService modelGatewayService,
      ApplicationEventPublisher eventPublisher
  ) {
    this.runRepository = runRepository;
    this.runService = runService;
    this.agentRepository = agentRepository;
    this.taskRepository = taskRepository;
    this.modelGatewayService = modelGatewayService;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Execute a single agent turn - the core execution method.
   * Orchestrates: state transition -> LLM call -> tool execution -> event persistence -> state finalization
   *
   * @param runId The run ID to execute
   * @return ExecutionResult containing the outcome of this turn
   * @throws ExecutionException if execution fails
   */
  @Transactional
  public RunExecutionResult executeSingleTurn(Long runId) throws ExecutionException {
    logger.info("Starting execution of single turn for run: {}", runId);

    try {
      // 1. Load and validate the run
      Run run = runRepository.findById(runId)
          .orElseThrow(() -> new ExecutionException("Run not found: " + runId));

      // Publish event: execution started
      publishRunEvent(run, RunEventType.EXECUTION_STARTED, "Execution engine starting turn");

      // 2. Validate run can be executed
      if (!isExecutable(run)) {
        String message = "Run cannot be executed in current state: " + run.getStatus();
        publishRunEvent(run, RunEventType.EXECUTION_FAILED, message);
        throw new ExecutionException(message);
      }

      // 3. Transition run to RUNNING state
      run.setStatus("running");
      run.setStartedAt(Instant.now());
      runRepository.save(run);
      publishRunEvent(run, RunEventType.STATE_TRANSITIONED, "Run transitioned to RUNNING");

      // 4. Load agent and task
      Agent agent = agentRepository.findById(run.getAgentId())
          .orElseThrow(() -> new ExecutionException("Agent not found: " + run.getAgentId()));
      Task task = taskRepository.findById(run.getTaskId())
          .orElseThrow(() -> new ExecutionException("Task not found: " + run.getTaskId()));

      // 5. Build LLM request from run context
      ModelProviderRequest request = buildModelRequest(run, agent, task);
      publishRunEvent(run, RunEventType.MODEL_CALL_SENT, "Sending request to model provider");

      // 6. Get response from model provider
      ModelProviderResponse response = modelGatewayService.sendRequest(request, agent.getModelPreference());
      if (!response.isSuccess()) {
        String errorMsg = "Model provider error: " + response.getErrorMessage();
        publishRunEvent(run, RunEventType.MODEL_CALL_FAILED, errorMsg);
        run.setStatus("failed");
        run.setErrorMessage(errorMsg);
        run.setCompletedAt(Instant.now());
        runRepository.save(run);
        throw new ExecutionException(errorMsg);
      }

      publishRunEvent(run, RunEventType.MODEL_RESPONSE_RECEIVED, "Model response received");

      // 7. Store the model response
      run.setOutput(response.getContent());
      runRepository.save(run);

      // 8. Finalize execution (mark as completed or ready for next turn)
      run.setStatus("completed");
      run.setCompletedAt(Instant.now());
      runRepository.save(run);
      publishRunEvent(run, RunEventType.TURN_COMPLETED, "Single turn execution completed successfully");

      logger.info("Successfully completed turn for run: {}", runId);

      // 9. Return execution result
      return RunExecutionResult.success(run, response, 1);

    } catch (ExecutionException e) {
      logger.error("Execution failed for run: {}", runId, e);
      throw e;
    } catch (Exception e) {
      logger.error("Unexpected error during execution of run: {}", runId, e);
      throw new ExecutionException("Unexpected execution error: " + e.getMessage(), e);
    }
  }

  /**
   * Build a ModelProviderRequest from current run context.
   * Constructs the prompt, system instructions, and message history.
   */
  private ModelProviderRequest buildModelRequest(Run run, Agent agent, Task task) {
    ModelProviderRequest request = new ModelProviderRequest();

    // Set model - use modelPreference from agent, or default
    String model = agent.getModelPreference() != null ? agent.getModelPreference() : "gpt-3.5-turbo";
    request.setModel(model);

    // Set system prompt from agent's system prompt
    String systemPrompt = agent.getSystemPrompt() != null
        ? agent.getSystemPrompt()
        : buildDefaultSystemPrompt(agent);
    request.setSystemPrompt(systemPrompt);

    // Build conversation history from run input
    List<ModelProviderRequest.Message> messages = new ArrayList<>();
    if (run.getInput() != null) {
      messages.add(new ModelProviderRequest.Message("user", run.getInput()));
    }
    request.setMessages(messages);

    // Set generation parameters with defaults
    request.setMaxTokens(2048);
    request.setTemperature(0.7);
    request.setTopP(0.9);

    return request;
  }

  /**
   * Build default system prompt if agent doesn't have custom instructions.
   */
  private String buildDefaultSystemPrompt(Agent agent) {
    return "You are an AI agent. Respond helpfully and accurately to user requests. "
        + "Always think step-by-step and explain your reasoning.";
  }

  /**
   * Validate that a run can be executed.
   * Checks status and permissions.
   */
  private boolean isExecutable(Run run) {
    String status = run.getStatus();
    return "pending".equals(status) || "running".equals(status);
  }

  /**
   * Publish a run event to persistence and event stream.
   */
  private void publishRunEvent(Run run, RunEventType eventType, String message) {
    try {
      // Build JSON payload with message and metadata
      Map<String, Object> eventData = new HashMap<>();
      eventData.put("message", message);
      eventData.put("timestamp", LocalDateTime.now().toString());
      String payload = convertToJson(eventData);
      
      // Record event using RunService
      RunEvent savedEvent = runService.recordEvent(run.getId(), eventType.toString(), payload);
      logger.debug("Published event: {} for run: {}", eventType, run.getId());

      // Also publish Spring event for real-time streaming
      eventPublisher.publishEvent(new RunExecutionEvent(this, savedEvent));
    } catch (Exception e) {
      logger.warn("Failed to publish event for run: {}", run.getId(), e);
      // Don't fail execution if event publishing fails
    }
  }

  /**
   * Convert object to JSON string.
   * Simple implementation - can be replaced with Jackson ObjectMapper if needed.
   */
  private String convertToJson(Object obj) {
    try {
      // Quick JSON conversion - in production use Jackson ObjectMapper
      return obj.toString();
    } catch (Exception e) {
      logger.warn("Failed to convert object to JSON", e);
      return "{}";
    }
  }

  /**
   * Check if execution can proceed (validate prerequisites).
   */
  public boolean canExecute(Long runId) {
    try {
      Run run = runRepository.findById(runId).orElse(null);
      if (run == null) return false;
      return isExecutable(run);
    } catch (Exception e) {
      logger.error("Error checking if run can execute: {}", runId, e);
      return false;
    }
  }

  /**
   * Get current execution status of a run.
   */
  public ExecutionStatus getExecutionStatus(Long runId) {
    try {
      Run run = runRepository.findById(runId).orElse(null);
      if (run == null) {
        return new ExecutionStatus(runId, "UNKNOWN", null);
      }
      return new ExecutionStatus(runId, run.getStatus(), run.getErrorMessage());
    } catch (Exception e) {
      logger.error("Error getting execution status for run: {}", runId, e);
      return new ExecutionStatus(runId, "ERROR", e.getMessage());
    }
  }
}
