package com.agentplatform.backend.execution;

import com.agentplatform.backend.runs.RunEvent;
import org.springframework.context.ApplicationEvent;

/**
 * Spring application event for run execution events.
 * Published when a run event occurs, enabling real-time event streaming.
 */
public class RunExecutionEvent extends ApplicationEvent {
  private RunEvent runEvent;

  public RunExecutionEvent(Object source, RunEvent runEvent) {
    super(source);
    this.runEvent = runEvent;
  }

  public RunEvent getRunEvent() {
    return runEvent;
  }

  public Long getRunId() {
    return runEvent.getRunId();
  }

  public String getEventType() {
    return runEvent.getEventType();
  }

  public String getPayload() {
    return runEvent.getPayload();
  }

  @Override
  public String toString() {
    return "RunExecutionEvent{" +
        "runId=" + runEvent.getRunId() +
        ", eventType=" + runEvent.getEventType() +
        ", payload='" + runEvent.getPayload() + '\'' +
        '}';
  }
}
