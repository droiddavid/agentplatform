package com.agentplatform.backend.runs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/runs")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Send a new message in a run
     * POST /api/runs/{runId}/messages
     */
    @PostMapping("/{runId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long runId,
            @RequestBody MessageRequest request) {
        try {
            request.setRunId(runId);
            MessageResponse response = messageService.sendMessage(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all messages for a run
     * GET /api/runs/{runId}/messages
     */
    @GetMapping("/{runId}/messages")
    public ResponseEntity<List<MessageResponse>> getRunMessages(@PathVariable Long runId) {
        List<MessageResponse> messages = messageService.getRunMessages(runId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get paginated messages for a run
     * GET /api/runs/{runId}/messages?page=0&size=20
     */
    @GetMapping("/{runId}/messages/paginated")
    public ResponseEntity<Page<MessageResponse>> getRunMessagesPaginated(
            @PathVariable Long runId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageResponse> messages = messageService.getRunMessagesPaginated(runId, pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get a specific message
     * GET /api/runs/{runId}/messages/{messageId}
     */
    @GetMapping("/{runId}/messages/{messageId}")
    public ResponseEntity<MessageResponse> getMessage(
            @PathVariable Long runId,
            @PathVariable Long messageId) {
        return messageService.getMessageById(messageId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get messages sent by a specific agent
     * GET /api/runs/{runId}/messages/sender/{agentId}
     */
    @GetMapping("/{runId}/messages/sender/{agentId}")
    public ResponseEntity<List<MessageResponse>> getMessagesBySender(
            @PathVariable Long runId,
            @PathVariable Long agentId) {
        List<MessageResponse> messages = messageService.getMessagesBySender(runId, agentId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get messages received by a specific agent
     * GET /api/runs/{runId}/messages/recipient/{agentId}
     */
    @GetMapping("/{runId}/messages/recipient/{agentId}")
    public ResponseEntity<List<MessageResponse>> getMessagesForRecipient(
            @PathVariable Long runId,
            @PathVariable Long agentId) {
        List<MessageResponse> messages = messageService.getMessagesForRecipient(runId, agentId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get messages of a specific type
     * GET /api/runs/{runId}/messages/type/{type}
     */
    @GetMapping("/{runId}/messages/type/{type}")
    public ResponseEntity<List<MessageResponse>> getMessagesByType(
            @PathVariable Long runId,
            @PathVariable String type) {
        List<MessageResponse> messages = messageService.getMessagesByType(runId, type);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get unread messages for an agent
     * GET /api/runs/{runId}/messages/unread/{agentId}
     */
    @GetMapping("/{runId}/messages/unread/{agentId}")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages(
            @PathVariable Long runId,
            @PathVariable Long agentId) {
        List<MessageResponse> messages = messageService.getUnreadMessages(runId, agentId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Mark message as read
     * PUT /api/runs/{runId}/messages/{messageId}/read
     */
    @PutMapping("/{runId}/messages/{messageId}/read")
    public ResponseEntity<MessageResponse> markAsRead(
            @PathVariable Long runId,
            @PathVariable Long messageId) {
        try {
            MessageResponse response = messageService.markMessageAsRead(messageId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a message
     * DELETE /api/runs/{runId}/messages/{messageId}
     */
    @DeleteMapping("/{runId}/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long runId,
            @PathVariable Long messageId) {
        try {
            messageService.deleteMessage(messageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get message count for a run
     * GET /api/runs/{runId}/messages/count
     */
    @GetMapping("/{runId}/messages/stats/count")
    public ResponseEntity<Long> getMessageCount(@PathVariable Long runId) {
        long count = messageService.countMessages(runId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get unread message count for an agent
     * GET /api/runs/{runId}/messages/unread-count/{agentId}
     */
    @GetMapping("/{runId}/messages/unread-count/{agentId}")
    public ResponseEntity<Long> getUnreadMessageCount(
            @PathVariable Long runId,
            @PathVariable Long agentId) {
        long count = messageService.countUnreadMessages(runId, agentId);
        return ResponseEntity.ok(count);
    }
}
