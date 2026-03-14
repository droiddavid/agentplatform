package com.agentplatform.backend.runs;

/**
 * Enumeration of run event types.
 * Represents different events that can occur during run execution.
 */
public enum RunEventType {
  // Execution lifecycle
  EXECUTION_STARTED("Execution started"),
  EXECUTION_FAILED("Execution failed"),
  EXECUTION_PAUSED("Execution paused"),
  EXECUTION_RESUMED("Execution resumed"),
  EXECUTION_CANCELLED("Execution cancelled"),

  // State transitions
  STATE_TRANSITIONED("State transitioned"),
  STATUS_CHANGED("Status changed"),

  // Model interaction
  MODEL_CALL_SENT("Model call sent"),
  MODEL_RESPONSE_RECEIVED("Model response received"),
  MODEL_CALL_FAILED("Model call failed"),
  MODEL_TIMEOUT("Model call timeout"),

  // Tool execution
  TOOL_INVOKED("Tool invoked"),
  TOOL_RESULT_RECEIVED("Tool result received"),
  TOOL_FAILED("Tool failed"),

  // Turn completion
  TURN_COMPLETED("Turn completed"),
  TURN_FAILED("Turn failed"),

  // Other
  EVENT_LOGGED("Event logged"),
  MESSAGE_SENT("Message sent"),
  MESSAGE_RECEIVED("Message received"),
  ERROR_OCCURRED("Error occurred");

  private final String displayName;

  RunEventType(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }

  /**
   * Convert string to RunEventType enum.
   * Handles enum name or display name.
   */
  public static RunEventType fromString(String value) {
    if (value == null) return null;
    try {
      return RunEventType.valueOf(value.toUpperCase());
    } catch (IllegalArgumentException e) {
      // Try matching by display name
      for (RunEventType type : values()) {
        if (type.displayName.equalsIgnoreCase(value)) {
          return type;
        }
      }
      return null;
    }
  }
}
