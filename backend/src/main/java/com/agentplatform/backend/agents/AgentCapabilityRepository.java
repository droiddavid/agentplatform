package com.agentplatform.backend.agents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentCapabilityRepository extends JpaRepository<AgentCapability, Long> {
    List<AgentCapability> findByAgent(Agent agent);
    List<AgentCapability> findByAgentAndEnabled(Agent agent, Boolean enabled);
}
