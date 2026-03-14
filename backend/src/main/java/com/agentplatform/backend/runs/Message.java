package com.agentplatform.backend.runs;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agent_messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "run_id", nullable = false)
    private Long runId;

    @Column(name = "sender_agent_id")
    private Long senderAgentId;

    @Column(name = "recipient_agent_id")
    private Long recipientAgentId;

    @Column(name = "message_type")
    private String messageType = "standard"; // standard, system, delegation, approval_request, etc.

    @Column(length = 255)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "JSON")
    private String metadata; // JSON object for additional data

    @Column(length = 50)
    private String status = "sent"; // sent, read, archived, deleted

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Message() {}

    public Message(Long runId, String content) {
        this.runId = runId;
        this.content = content;
    }

    public Message(Long runId, Long senderAgentId, Long recipientAgentId, String content) {
        this.runId = runId;
        this.senderAgentId = senderAgentId;
        this.recipientAgentId = recipientAgentId;
        this.content = content;
    }

    public Long getId() { return id; }
    public Long getRunId() { return runId; }
    public void setRunId(Long runId) { this.runId = runId; }
    public Long getSenderAgentId() { return senderAgentId; }
    public void setSenderAgentId(Long senderAgentId) { this.senderAgentId = senderAgentId; }
    public Long getRecipientAgentId() { return recipientAgentId; }
    public void setRecipientAgentId(Long recipientAgentId) { this.recipientAgentId = recipientAgentId; }
    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
