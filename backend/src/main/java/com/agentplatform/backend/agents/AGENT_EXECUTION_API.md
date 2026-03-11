# Agent Execution API Documentation

## Overview
The Agent Execution API allows users to track agent executions, monitor their status, and retrieve results. Each execution is identified by a unique session ID and includes input, output, and status information.

## Base URL
```
/api/agents
```

## Data Models

### AgentExecution
```json
{
  "id": 1,
  "agentId": 5,
  "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "completed",
  "input": "Input data for the agent",
  "output": "Result output from agent execution",
  "errorMessage": null,
  "createdAt": "2024-01-10T10:30:00Z",
  "startedAt": "2024-01-10T10:30:01Z",
  "completedAt": "2024-01-10T10:30:05Z",
  "reasonId": 123
}
```

### Execution Statuses
- `pending` - Execution created but not started
- `running` - Execution is currently running
- `completed` - Execution finished successfully
- `failed` - Execution failed with error

## Endpoints

### 1. Start a New Execution
**POST** `/api/agents/{agentId}/executions`

Start a new execution session for a specific agent.

**Authentication:** Required (JWT token)

**Path Parameters:**
- `agentId` (Long): The ID of the agent to execute

**Request Body:**
```json
{
  "input": "Input data for the agent",
  "reasonId": 123
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "agentId": 5,
  "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "pending",
  "input": "Input data for the agent",
  "output": null,
  "errorMessage": null,
  "createdAt": "2024-01-10T10:30:00Z",
  "startedAt": null,
  "completedAt": null,
  "reasonId": 123
}
```

**Errors:**
- `404 Not Found` - Agent not found or not owned by user

---

### 2. Get Execution by Session ID
**GET** `/api/agents/executions/session/{sessionId}`

Retrieve execution details using the session ID (public endpoint, no auth required).

**Path Parameters:**
- `sessionId` (String): The unique session ID of the execution

**Response (200 OK):**
```json
{
  "id": 1,
  "agentId": 5,
  "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "completed",
  "input": "Input data",
  "output": "Result data",
  "errorMessage": null,
  "createdAt": "2024-01-10T10:30:00Z",
  "startedAt": "2024-01-10T10:30:01Z",
  "completedAt": "2024-01-10T10:30:05Z",
  "reasonId": 123
}
```

**Errors:**
- `404 Not Found` - Session not found

---

### 3. Get Execution Details
**GET** `/api/agents/{agentId}/executions/{executionId}`

Retrieve execution details (requires ownership verification).

**Authentication:** Required (JWT token)

**Path Parameters:**
- `agentId` (Long): The agent ID
- `executionId` (Long): The execution ID

**Response (200 OK):**
Same as endpoint 2

**Errors:**
- `404 Not Found` - Execution not found or user is not owner

---

### 4. List Executions for Agent
**GET** `/api/agents/{agentId}/executions`

List all executions for a specific agent (most recent first).

**Authentication:** Required (JWT token)

**Path Parameters:**
- `agentId` (Long): The agent ID

**Query Parameters:**
- None

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "agentId": 5,
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "completed",
    ...
  },
  {
    "id": 2,
    "agentId": 5,
    "sessionId": "a47ac10b-58cc-4372-a567-0e02b2c3d480",
    "status": "pending",
    ...
  }
]
```

**Errors:**
- `404 Not Found` - Agent not found or user is not owner

---

### 5. List All Executions for Current User
**GET** `/api/agents/executions/all`

List all executions across all agents for the current user.

**Authentication:** Required (JWT token)

**Query Parameters:**
- None

**Response (200 OK):**
```json
[
  { /* execution 1 */ },
  { /* execution 2 */ },
  ...
]
```

---

### 6. Update Execution Status
**PATCH** `/api/agents/{agentId}/executions/{executionId}/status`

Update the status of an execution.

**Authentication:** Required (JWT token)

**Path Parameters:**
- `agentId` (Long): The agent ID
- `executionId` (Long): The execution ID

**Query Parameters:**
- `status` (String): New status (`running`, `completed`, `failed`, or `pending`)

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "running",
  "startedAt": "2024-01-10T10:30:01Z",
  ...
}
```

**Errors:**
- `404 Not Found` - Execution not found or user is not owner

---

### 7. Complete Execution with Output
**PATCH** `/api/agents/{agentId}/executions/{executionId}/complete`

Mark an execution as completed and provide the output.

**Authentication:** Required (JWT token)

**Path Parameters:**
- `agentId` (Long): The agent ID
- `executionId` (Long): The execution ID

**Query Parameters:**
- `output` (String): The output/result from the execution

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "completed",
  "output": "Result data",
  "completedAt": "2024-01-10T10:30:05Z",
  ...
}
```

**Errors:**
- `404 Not Found` - Execution not found or user is not owner

---

### 8. Fail Execution with Error
**PATCH** `/api/agents/{agentId}/executions/{executionId}/fail`

Mark an execution as failed with an error message.

**Authentication:** Required (JWT token)

**Path Parameters:**
- `agentId` (Long): The agent ID
- `executionId` (Long): The execution ID

**Query Parameters:**
- `errorMessage` (String): The error message

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "failed",
  "errorMessage": "Error description",
  "completedAt": "2024-01-10T10:30:05Z",
  ...
}
```

**Errors:**
- `404 Not Found` - Execution not found or user is not owner

---

## Usage Examples

### Example Flow 1: Complete Execution
```bash
# 1. Start execution
curl -X POST http://localhost:8080/api/agents/5/executions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":"What is 2+2?","reasonId":null}'

# Response includes sessionId, e.g., "f47ac10b-58cc-4372-a567-0e02b2c3d479"

# 2. Check status using session ID (anyone can do this)
curl http://localhost:8080/api/agents/executions/session/f47ac10b-58cc-4372-a567-0e02b2c3d479

# 3. Update status to running  
curl -X PATCH "http://localhost:8080/api/agents/5/executions/1/status?status=running" \
  -H "Authorization: Bearer TOKEN"

# 4. Complete execution with output
curl -X PATCH "http://localhost:8080/api/agents/5/executions/1/complete?output=The%20answer%20is%204" \
  -H "Authorization: Bearer TOKEN"
```

### Example Flow 2: Handle Execution Error
```bash
# 1. Start execution
curl -X POST http://localhost:8080/api/agents/5/executions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":"Complex query"}'

# 2. Update to running
curl -X PATCH "http://localhost:8080/api/agents/5/executions/2/status?status=running" \
  -H "Authorization: Bearer TOKEN"

# 3. Fail execution with error
curl -X PATCH "http://localhost:8080/api/agents/5/executions/2/fail?errorMessage=Timeout%20after%2030%20seconds" \
  -H "Authorization: Bearer TOKEN"
```

---

## Security Notes

1. **Authentication**: All endpoints except `/executions/session/{sessionId}` require a valid JWT token
2. **Ownership Verification**: When working with specific agents/executions, the system verifies that the user owns that resource
3. **Session ID**: The session ID is a public identifier that can be shared to allow external systems to check execution status
4. **Input/Output**: These fields can contain arbitrary text/JSON; no automatic validation is performed

---

## Implementation Notes

- Timestamps are in ISO 8601 format (UTC)
- Execution records are tied to the owner (user) for multi-tenancy support
- The `reasonId` field is optional and can link an execution to another entity (e.g., a task or reason object)
- All times include `startedAt` and `completedAt` to track execution duration
