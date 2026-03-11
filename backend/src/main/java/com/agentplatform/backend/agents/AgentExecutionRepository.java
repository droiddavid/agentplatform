package com.agentplatform.backend.agents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentExecutionRepository extends JpaRepository<AgentExecution, Long> {
    List<AgentExecution> findByAgentIdAndOwnerId(Long agentId, Long ownerId);
    List<AgentExecution> findByOwnerId(Long ownerId);
    Optional<AgentExecution> findBySessionId(String sessionId);
    List<AgentExecution> findByAgentIdAndOwnerIdOrderByCreatedAtDesc(Long agentId, Long ownerId);
}
