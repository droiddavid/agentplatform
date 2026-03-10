package com.agentplatform.backend.audit;

import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditEventRepository repo;

    public AuditService(AuditEventRepository repo) { this.repo = repo; }

    public AuditEvent record(Long userId, String eventType, String payload) {
        AuditEvent e = new AuditEvent(userId, eventType, payload);
        return repo.save(e);
    }
}
