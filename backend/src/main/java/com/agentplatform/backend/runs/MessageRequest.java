package com.agentplatform.backend.runs;

import java.time.Instant;

public class MessageRequest {
    private Long runId;
    private Long senderAgentId;
    private Long recipientAgentId;
    private String messageType;
    private String subject;
    private String content;
    private String metadata;

    public MessageRequest() {}

    public MessageRequest(Long runId, String content) {
        this.runId = runId;
        this.content = content;
    }

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
}
