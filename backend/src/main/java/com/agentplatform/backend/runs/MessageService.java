package com.agentplatform.backend.runs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * Send a new message
     */
    public MessageResponse sendMessage(MessageRequest request) {
        if (request.getRunId() == null) {
            throw new IllegalArgumentException("Run ID is required");
        }
        if (request.getContent() == null || request.getContent().isEmpty()) {
            throw new IllegalArgumentException("Message content is required");
        }

        Message message = new Message(request.getRunId(), request.getContent());
        message.setSenderAgentId(request.getSenderAgentId());
        message.setRecipientAgentId(request.getRecipientAgentId());

        if (request.getMessageType() != null) {
            message.setMessageType(request.getMessageType());
        }
        if (request.getSubject() != null) {
            message.setSubject(request.getSubject());
        }
        if (request.getMetadata() != null) {
            message.setMetadata(request.getMetadata());
        }

        Message saved = messageRepository.save(message);
        return new MessageResponse(saved);
    }

    /**
     * Get a message by ID
     */
    public Optional<MessageResponse> getMessageById(Long id) {
        return messageRepository.findById(id)
                .map(MessageResponse::new);
    }

    /**
     * Get all messages for a run
     */
    public List<MessageResponse> getRunMessages(Long runId) {
        return messageRepository.findByRunIdOrderByCreatedAtAsc(runId)
                .stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get paginated messages for a run
     */
    public Page<MessageResponse> getRunMessagesPaginated(Long runId, Pageable pageable) {
        return messageRepository.findByRunId(runId, pageable)
                .map(MessageResponse::new);
    }

    /**
     * Get messages sent by a specific agent
     */
    public List<MessageResponse> getMessagesBySender(Long runId, Long agentId) {
        return messageRepository.findBySenderAgentIdAndRunId(agentId, runId)
                .stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get messages received by a specific agent
     */
    public List<MessageResponse> getMessagesForRecipient(Long runId, Long agentId) {
        return messageRepository.findByRecipientAgentIdAndRunId(agentId, runId)
                .stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get messages of a specific type
     */
    public List<MessageResponse> getMessagesByType(Long runId, String messageType) {
        return messageRepository.findByRunIdAndMessageType(runId, messageType)
                .stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get unread messages for an agent
     */
    public List<MessageResponse> getUnreadMessages(Long runId, Long agentId) {
        return messageRepository.findUnreadMessagesForAgent(runId, agentId)
                .stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Mark a message as read
     */
    public MessageResponse markMessageAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        message.setStatus("read");
        message.setUpdatedAt(Instant.now());

        Message updated = messageRepository.save(message);
        return new MessageResponse(updated);
    }

    /**
     * Delete a message
     */
    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }

    /**
     * Count messages in a run
     */
    public long countMessages(Long runId) {
        return messageRepository.countByRunId(runId);
    }

    /**
     * Count unread messages for an agent
     */
    public long countUnreadMessages(Long runId, Long agentId) {
        return messageRepository.countByRunIdAndRecipientAgentIdAndStatus(runId, agentId, "sent");
    }
}
