package com.agentplatform.backend.agents;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByOwnerId(Long ownerId);
}
