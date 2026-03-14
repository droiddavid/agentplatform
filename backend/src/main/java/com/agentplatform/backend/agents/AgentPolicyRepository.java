package com.agentplatform.backend.agents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentPolicyRepository extends JpaRepository<AgentPolicy, Long> {
    List<AgentPolicy> findByAgent(Agent agent);
}
