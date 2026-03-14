package com.agentplatform.backend.runs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RunEventRepository extends JpaRepository<RunEvent, Long> {
    List<RunEvent> findByRunIdOrderBySequenceAsc(Long runId);
    long countByRunId(Long runId);
}
