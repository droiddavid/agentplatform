package com.agentplatform.backend.runs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface SharedContextEntryRepository extends JpaRepository<SharedContextEntry, String> {
    List<SharedContextEntry> findByRunIdOrderByUpdatedAtDesc(String runId);
    Page<SharedContextEntry> findByRunId(String runId, Pageable pageable);
    List<SharedContextEntry> findByRunIdAndContextKey(String runId, String contextKey);
    List<SharedContextEntry> findByRunIdAndVisibilityScope(String runId, String visibilityScope);
    List<SharedContextEntry> findByCreatedByRunAgentId(String createdByRunAgentId);
    Optional<SharedContextEntry> findByRunIdAndContextKeyOrderByUpdatedAtDesc(String runId, String contextKey);
    long countByRunId(String runId);
    long countByRunIdAndVisibilityScope(String runId, String visibilityScope);
}
