package com.agentplatform.backend.runs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SharedContextEntryService {
    @Autowired
    private SharedContextEntryRepository sharedContextEntryRepository;

    public SharedContextEntryResponse createContextEntry(SharedContextEntryRequest request) {
        SharedContextEntry entry = new SharedContextEntry(
            UUID.randomUUID().toString().substring(0, 26),
            request.getRunId(),
            request.getCreatedByRunAgentId(),
            request.getContextKey(),
            request.getContextValueJson(),
            request.getVisibilityScope());

        SharedContextEntry saved = sharedContextEntryRepository.save(entry);
        return new SharedContextEntryResponse(saved);
    }

    public SharedContextEntryResponse getContextEntryById(String id) {
        Optional<SharedContextEntry> entry = sharedContextEntryRepository.findById(id);
        return entry.map(SharedContextEntryResponse::new).orElse(null);
    }

    public List<SharedContextEntryResponse> getRunContextEntries(String runId) {
        List<SharedContextEntry> entries = sharedContextEntryRepository.findByRunIdOrderByUpdatedAtDesc(runId);
        return entries.stream().map(SharedContextEntryResponse::new).toList();
    }

    public Page<SharedContextEntryResponse> getRunContextEntriesPaginated(String runId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SharedContextEntry> entries = sharedContextEntryRepository.findByRunId(runId, pageable);
        return entries.map(SharedContextEntryResponse::new);
    }

    public List<SharedContextEntryResponse> getContextEntriesByKey(String runId, String contextKey) {
        List<SharedContextEntry> entries = sharedContextEntryRepository.findByRunIdAndContextKey(runId, contextKey);
        return entries.stream().map(SharedContextEntryResponse::new).toList();
    }

    public List<SharedContextEntryResponse> getContextEntriesByVisibilityScope(String runId, String visibilityScope) {
        List<SharedContextEntry> entries = sharedContextEntryRepository.findByRunIdAndVisibilityScope(runId, visibilityScope);
        return entries.stream().map(SharedContextEntryResponse::new).toList();
    }

    public SharedContextEntryResponse getLatestContextEntryByKey(String runId, String contextKey) {
        Optional<SharedContextEntry> entry = sharedContextEntryRepository.findByRunIdAndContextKeyOrderByUpdatedAtDesc(runId, contextKey);
        return entry.map(SharedContextEntryResponse::new).orElse(null);
    }

    public SharedContextEntryResponse updateContextEntry(String id, SharedContextEntryRequest request) {
        Optional<SharedContextEntry> existing = sharedContextEntryRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        SharedContextEntry entry = existing.get();
        if (request.getContextValueJson() != null) {
            entry.setContextValueJson(request.getContextValueJson());
        }
        if (request.getVisibilityScope() != null) {
            entry.setVisibilityScope(request.getVisibilityScope());
        }
        entry.setUpdatedAt(Instant.now());

        SharedContextEntry updated = sharedContextEntryRepository.save(entry);
        return new SharedContextEntryResponse(updated);
    }

    public void deleteContextEntry(String id) {
        sharedContextEntryRepository.deleteById(id);
    }

    public long getContextEntryCount(String runId) {
        return sharedContextEntryRepository.countByRunId(runId);
    }

    public long getContextEntryCountByVisibilityScope(String runId, String visibilityScope) {
        return sharedContextEntryRepository.countByRunIdAndVisibilityScope(runId, visibilityScope);
    }
}
