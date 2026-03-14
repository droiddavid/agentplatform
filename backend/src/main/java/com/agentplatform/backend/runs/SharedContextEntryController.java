package com.agentplatform.backend.runs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/runs/{runId}/context-entries")
@CrossOrigin(origins = "*")
public class SharedContextEntryController {
    @Autowired
    private SharedContextEntryService sharedContextEntryService;

    @PostMapping
    public ResponseEntity<SharedContextEntryResponse> createContextEntry(@PathVariable String runId, @RequestBody SharedContextEntryRequest request) {
        request.setRunId(runId);
        SharedContextEntryResponse response = sharedContextEntryService.createContextEntry(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SharedContextEntryResponse>> getContextEntries(@PathVariable String runId) {
        List<SharedContextEntryResponse> entries = sharedContextEntryService.getRunContextEntries(runId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<SharedContextEntryResponse>> getContextEntriesPaginated(
            @PathVariable String runId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SharedContextEntryResponse> entries = sharedContextEntryService.getRunContextEntriesPaginated(runId, page, size);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{entryId}")
    public ResponseEntity<SharedContextEntryResponse> getContextEntry(@PathVariable String runId, @PathVariable String entryId) {
        SharedContextEntryResponse entry = sharedContextEntryService.getContextEntryById(entryId);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/key/{contextKey}")
    public ResponseEntity<List<SharedContextEntryResponse>> getContextEntriesByKey(@PathVariable String runId, @PathVariable String contextKey) {
        List<SharedContextEntryResponse> entries = sharedContextEntryService.getContextEntriesByKey(runId, contextKey);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/key/{contextKey}/latest")
    public ResponseEntity<SharedContextEntryResponse> getLatestContextEntryByKey(@PathVariable String runId, @PathVariable String contextKey) {
        SharedContextEntryResponse entry = sharedContextEntryService.getLatestContextEntryByKey(runId, contextKey);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/visibility/{visibilityScope}")
    public ResponseEntity<List<SharedContextEntryResponse>> getContextEntriesByVisibilityScope(@PathVariable String runId, @PathVariable String visibilityScope) {
        List<SharedContextEntryResponse> entries = sharedContextEntryService.getContextEntriesByVisibilityScope(runId, visibilityScope);
        return ResponseEntity.ok(entries);
    }

    @PutMapping("/{entryId}")
    public ResponseEntity<SharedContextEntryResponse> updateContextEntry(@PathVariable String runId, @PathVariable String entryId, @RequestBody SharedContextEntryRequest request) {
        SharedContextEntryResponse entry = sharedContextEntryService.updateContextEntry(entryId, request);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entry);
    }

    @DeleteMapping("/{entryId}")
    public ResponseEntity<Void> deleteContextEntry(@PathVariable String runId, @PathVariable String entryId) {
        sharedContextEntryService.deleteContextEntry(entryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> getContextEntryCount(@PathVariable String runId) {
        long count = sharedContextEntryService.getContextEntryCount(runId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/count-by-visibility/{visibilityScope}")
    public ResponseEntity<Long> getContextEntryCountByVisibilityScope(@PathVariable String runId, @PathVariable String visibilityScope) {
        long count = sharedContextEntryService.getContextEntryCountByVisibilityScope(runId, visibilityScope);
        return ResponseEntity.ok(count);
    }
}
