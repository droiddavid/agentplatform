# Epic 10: Run Domain - Integration Tests

## Overview
This document outlines the integration tests for Epic 10 (Run Domain Foundation) which implements complete execution tracking with event timeline support.

## Test Scenarios

### Scenario 1: Complete Run Execution Flow (Happy Path)
**Objective:** Verify that a run transitions through all lifecycle states and events are recorded at each step.

**Prerequisites:**
- Backend service running on http://localhost:8080
- Frontend running on http://localhost:4200
- Database with test user, agents, and tasks created

**Steps:**

1. **Create a Run**
   - API: POST /api/runs
   - Payload:
     ```json
     {
       "taskId": 1,
       "agentId": 1,
       "input": "Test input for run execution",
       "status": "pending"
     }
     ```
   - Expected: Run created with status "pending"
   - Expected Event: "run_created" event recorded with sequence 1
   - Verify: GET /api/runs/{runId}/events returns 1 event

2. **Start the Run**
   - API: POST /api/runs/{runId}/start
   - Expected: Run status changes to "running", startedAt timestamp set
   - Expected Event: "run_started" event recorded with sequence 2
   - Verify: GET /api/runs/{runId}/events returns 2 events in sequence order

3. **Complete the Run**
   - API: POST /api/runs/{runId}/complete
   - Payload Query: ?output=Test%20output&logs=Execution%20successful
   - Expected: Run status changes to "completed", completedAt timestamp set, output saved
   - Expected Event: "run_completed" event recorded with sequence 3
   - Verify: GET /api/runs/{runId}/events returns 3 events
   - Event payload contains: "Run completed successfully. Output: Test output"

4. **Verify Timeline Display**
   - Frontend: Navigate to run-detail/:runId
   - Expected: Overview tab shows run details
   - Click "Events (3)" tab
   - Expected: Timeline displays all 3 events in order:
     - Event 1: "run_created" at T0
     - Event 2: "run_started" at T1
     - Event 3: "run_completed" at T2
   - Visual verification: Event markers visible, timestamps correct, payloads display

### Scenario 2: Run Completion with Error
**Objective:** Verify that failed runs are tracked with error events.

**Steps:**

1. **Create and Start a Run** (same as Scenario 1, steps 1-2)

2. **Fail the Run**
   - API: POST /api/runs/{runId}/fail
   - Payload Query: ?errorMessage=Database%20connection%20timeout&logs=Error%20stack%20trace
   - Expected: Run status changes to "failed", errorMessage saved
   - Expected Event: "run_failed" event recorded with sequence 3
   - Verify: Event payload contains error summary

3. **Verify Error Timeline**
   - Frontend: Navigate to run-detail/:runId
   - Click "Events (3)" tab
   - Event 3 shows: "run_failed" with error details
   - Click "Error" tab to see full error message

### Scenario 3: Run Cancellation
**Objective:** Verify that cancelled runs record cancellation events.

**Steps:**

1. **Create and Start a Run** (same as Scenario 1, steps 1-2)

2. **Cancel the Run**
   - Frontend: run-detail/:runId, click "Cancel Run" button, confirm
   - OR Backend: POST /api/runs/{runId}/cancel
   - Expected: Run status changes to "cancelled", completedAt timestamp set
   - Expected Event: "run_cancelled" event recorded with sequence 3

3. **Verify Cancellation Timeline**
   - Navigate to Events tab
   - Event 3 shows: "run_cancelled" with cancellation timestamp

### Scenario 4: Event Ordering and Timestamps
**Objective:** Verify that events maintain chronological order and accurate timestamps.

**Steps:**

1. **Execute complete run** (Scenario 1)

2. **Verify Event Sequence**
   - API: GET /api/runs/{runId}/events
   - Expected Response:
     ```json
     [
       {
         "id": 1,
         "runId": 1,
         "sequence": 1,
         "eventType": "run_created",
         "payload": "Run created for task #1 with agent #1",
         "createdAt": "2026-03-14T00:44:30Z"
       },
       {
         "id": 2,
         "runId": 1,
         "sequence": 2,
         "eventType": "run_started",
         "payload": "Run execution started at 2026-03-14T00:44:35Z",
         "createdAt": "2026-03-14T00:44:35Z"
       },
       {
         "id": 3,
         "runId": 1,
         "sequence": 3,
         "eventType": "run_completed",
         "payload": "Run completed successfully. Output: Test output",
         "createdAt": "2026-03-14T00:44:40Z"
       }
     ]
     ```
   - Verify: sequence numbers are 1, 2, 3 (contiguous)
   - Verify: timestamps increase monotonically
   - Verify: createdAt timestamps match event timing

### Scenario 5: Event Pagination and Count
**Objective:** Verify that large event lists are handled correctly.

**Steps:**

1. **Create multiple events** (simulate by running scenario 1 multiple times)

2. **Count Events**
   - API: GET /api/runs/{runId}/events (should return all events)
   - OR: Backend POST /api/runs/{runId}/events should show count

3. **Verify Pagination**
   - Frontend: Events tab should display all events without pagination
   - Verify: Scrollable if many events

### Scenario 6: Frontend Event Tab Refresh
**Objective:** Verify that Events tab auto-refreshes when selected.

**Steps:**

1. **Navigate to run-detail/:runId**
   - Overview tab is shown by default

2. **Start the Run** (button on Overview tab)
   - Run transitions to "running"
   - Events tab shows count changes to (2)

3. **Click Events Tab**
   - Expected: Tab refreshes automatically
   - Timeline shows 2 events: "run_created" and "run_started"

4. **Complete the Run** (simulated by API call in another session)
   - Switch back to Overview tab
   - Click Events tab again
   - Expected: Now shows 3 events (refreshed)

### Scenario 7: Empty Run (No Events Yet)
**Objective:** Verify graceful handling when no events exist.

**Steps:**

1. **Create a Run but Don't Start It**
   - Status remains "pending" without calling start endpoint
   - Expected: "run_created" event exists (sequence 1)

2. **Navigate to run-detail/:runId**
   - Events tab button shows "Events (1)"
   - Click Events tab
   - Timeline shows only "run_created" event

## API Endpoint Testing

### POST /api/runs
```bash
curl -X POST http://localhost:8080/api/runs \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": 1,
    "agentId": 1,
    "input": "Test input",
    "status": "pending"
  }'
```

### POST /api/runs/{runId}/start
```bash
curl -X POST http://localhost:8080/api/runs/1/start
```

### POST /api/runs/{runId}/complete
```bash
curl -X POST "http://localhost:8080/api/runs/1/complete?output=Test%20output&logs=Execution%20log"
```

### POST /api/runs/{runId}/fail
```bash
curl -X POST "http://localhost:8080/api/runs/1/fail?errorMessage=Error%20message&logs=Error%20log"
```

### POST /api/runs/{runId}/cancel
```bash
curl -X POST http://localhost:8080/api/runs/1/cancel
```

### GET /api/runs/{runId}/events
```bash
curl -X GET http://localhost:8080/api/runs/1/events
```

### POST /api/runs/{runId}/events (Manual Event Recording)
```bash
curl -X POST http://localhost:8080/api/runs/1/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "custom_event",
    "payload": "Custom event details"
  }'
```

## Frontend Component Testing

### run-detail.component Tests

**Test 1: Tab Selection and Event Loading**
- Click Events tab
- Verify events load automatically
- Verify count badge displays correctly

**Test 2: Timeline Rendering**
- Verify each event displays with:
  - Event type badge (colored)
  - Timestamp (formatted date/time)
  - Payload (scrollable if long)
  - Event marker (dot on timeline)

**Test 3: Run State Transitions**
- Start button visible when status is "pending"
- Cancel button visible when status is "running"
- Buttons update upon state transition
- Events tab refreshes and shows new event

**Test 4: Status Colors**
- Table shows correct color per status:
  - pending: yellow
  - running: blue
  - completed: green
  - failed: red
  - cancelled: gray

## Database Verification

### Query to Verify Events Recorded
```sql
SELECT * FROM run_events WHERE run_id = 1 ORDER BY sequence ASC;
```

Expected columns:
- id: AUTO_INCREMENT
- run_id: 1
- sequence: 1, 2, 3, ... (contiguous)
- event_type: run_created, run_started, run_completed/failed
- payload: Event details
- created_at: Timestamp

### Query to Verify Run State
```sql
SELECT id, task_id, agent_id, status, started_at, completed_at, 
       error_message, created_at, updated_at FROM runs WHERE id = 1;
```

## Success Criteria

✅ All events are recorded at correct lifecycle points
✅ Events are retrieved in sequence order (sorted by sequence ASC)
✅ Timestamps are accurate and monotonic
✅ Frontend displays all events in timeline
✅ Event details are preserved and displayed correctly
✅ Run state transitions are atomic (status changes + event recorded)
✅ Empty event lists handled gracefully
✅ UI auto-refreshes on tab selection
✅ All 5 lifecycle events tested: created, started, completed/failed, cancelled

## Known Limitations

- Events not real-time (frontend must refresh or manually load)
- No event filtering or search implemented
- No event export or reporting
- Event payloads are text (could be enhanced to structured data later)

## Future Enhancements (Phase 3+)

- WebSocket support for real-time event streaming
- Event filtering and search
- Event aggregation and analytics
- Custom event types and payloads
- Event attachment (files, logs)
- Event replay and simulation
