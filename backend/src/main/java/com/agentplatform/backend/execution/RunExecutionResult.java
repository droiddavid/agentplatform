package com.agentplatform.backend.execution;

import com.agentplatform.backend.models.provider.ModelProviderResponse;
import com.agentplatform.backend.runs.Run;

import java.time.Instant;

/**
 * Result of executing a single agent turn.
 * Contains the outcome, output, and execution metadata.
 */
public class RunExecutionResult {
  private Long runId;
  private boolean success;
  private String output;
  private String errorMessage;
  private int tokenUsed;
  private int turnNumber;
  private Instant startedAt;
  private Instant completedAt;

  public RunExecutionResult() {
  }

  private RunExecutionResult(
      Long runId,
      boolean success,
      String output,
      String errorMessage,
      int tokenUsed,
      int turnNumber,
      Instant startedAt,
      Instant completedAt
  ) {
    this.runId = runId;
    this.success = success;
    this.output = output;
    this.errorMessage = errorMessage;
    this.tokenUsed = tokenUsed;
    this.turnNumber = turnNumber;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
  }

  public static RunExecutionResult success(Run run, ModelProviderResponse response, int turnNumber) {
    return new RunExecutionResult(
        run.getId(),
        true,
        response.getContent(),
        null,
        response.getTotalTokens() > 0 ? response.getTotalTokens() : 0,
        turnNumber,
        run.getStartedAt(),
        Instant.now()
    );
  }

  public static RunExecutionResult failure(Long runId, String errorMessage) {
    return new RunExecutionResult(
        runId,
        false,
        null,
        errorMessage,
        0,
        0,
        Instant.now(),
        Instant.now()
    );
  }

  // Getters
  public Long getRunId() {
    return runId;
  }

  public boolean isSuccess() {
    return success;
  }

  public String getOutput() {
    return output;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public int getTokenUsed() {
    return tokenUsed;
  }

  public int getTurnNumber() {
    return turnNumber;
  }

  public Instant getStartedAt() {
    return startedAt;
  }

  public Instant getCompletedAt() {
    return completedAt;
  }

  // Setters
  public void setRunId(Long runId) {
    this.runId = runId;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public void setOutput(String output) {
    this.output = output;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public void setTokenUsed(int tokenUsed) {
    this.tokenUsed = tokenUsed;
  }

  public void setTurnNumber(int turnNumber) {
    this.turnNumber = turnNumber;
  }

  public void setStartedAt(Instant startedAt) {
    this.startedAt = startedAt;
  }

  public void setCompletedAt(Instant completedAt) {
    this.completedAt = completedAt;
  }
}
