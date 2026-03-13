package com.agentplatform.backend.agents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentToolPermissionRepository extends JpaRepository<AgentToolPermission, Long> {
    List<AgentToolPermission> findByAgent(Agent agent);
    List<AgentToolPermission> findByAgentAndRequiresApprovalTrue(Agent agent);
}
