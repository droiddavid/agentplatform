package com.agentplatform.backend.audit;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final AuditEventRepository repo;

    public AuditController(AuditEventRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<?> query(@RequestParam(required = false) Long userId,
                                   @RequestParam(required = false) String eventType,
                                   @RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "50") int size) {
        var pr = PageRequest.of(page, size);
        var pageRes = repo.findAll(pr);
        return ResponseEntity.ok(pageRes);
    }
}
