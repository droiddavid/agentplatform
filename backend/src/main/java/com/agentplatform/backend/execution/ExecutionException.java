package com.agentplatform.backend.execution;

/**
 * Exception thrown when execution fails.
 * Wraps execution errors with context.
 */
public class ExecutionException extends Exception {
  private String executionPhase;
  private long runId;

  public ExecutionException(String message) {
    super(message);
  }

  public ExecutionException(String message, Throwable cause) {
    super(message, cause);
  }

  public ExecutionException(String message, String executionPhase, long runId) {
    super(message);
    this.executionPhase = executionPhase;
    this.runId = runId;
  }

  public ExecutionException(String message, Throwable cause, String executionPhase, long runId) {
    super(message, cause);
    this.executionPhase = executionPhase;
    this.runId = runId;
  }

  public String getExecutionPhase() {
    return executionPhase;
  }

  public long getRunId() {
    return runId;
  }

  @Override
  public String toString() {
    if (executionPhase != null) {
      return "ExecutionException [" + executionPhase + "] Run #" + runId + ": " + getMessage();
    }
    return super.toString();
  }
}
