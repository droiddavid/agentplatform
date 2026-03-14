package com.agentplatform.backend.runs;

import java.time.Instant;

public class MessageResponse {
    private Long id;
    private Long runId;
    private Long senderAgentId;
    private Long recipientAgentId;
    private String messageType;
    private String subject;
    private String content;
    private String metadata;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public MessageResponse() {}

    public MessageResponse(Message message) {
        this.id = message.getId();
        this.runId = message.getRunId();
        this.senderAgentId = message.getSenderAgentId();
        this.recipientAgentId = message.getRecipientAgentId();
        this.messageType = message.getMessageType();
        this.subject = message.getSubject();
        this.content = message.getContent();
        this.metadata = message.getMetadata();
        this.status = message.getStatus();
        this.createdAt = message.getCreatedAt();
        this.updatedAt = message.getUpdatedAt();
    }

    public Long getId() { return id; }
    public Long getRunId() { return runId; }
    public Long getSenderAgentId() { return senderAgentId; }
    public Long getRecipientAgentId() { return recipientAgentId; }
    public String getMessageType() { return messageType; }
    public String getSubject() { return subject; }
    public String getContent() { return content; }
    public String getMetadata() { return metadata; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
