package com.agentplatform.backend.execution;

/**
 * Current execution status of a run.
 * Lightweight DTO for status queries.
 */
public class ExecutionStatus {
  private Long runId;
  private String status;
  private String errorMessage;
  private Long timestamp;

  public ExecutionStatus() {
  }

  public ExecutionStatus(Long runId, String status, String errorMessage) {
    this.runId = runId;
    this.status = status;
    this.errorMessage = errorMessage;
    this.timestamp = System.currentTimeMillis();
  }

  // Getters
  public Long getRunId() {
    return runId;
  }

  public String getStatus() {
    return status;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public Long getTimestamp() {
    return timestamp;
  }

  // Setters
  public void setRunId(Long runId) {
    this.runId = runId;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public void setTimestamp(Long timestamp) {
    this.timestamp = timestamp;
  }

  public boolean isRunning() {
    return "RUNNING".equals(status);
  }

  public boolean isCompleted() {
    return "COMPLETED".equals(status) || "FAILED".equals(status) || "CANCELLED".equals(status);
  }
}
