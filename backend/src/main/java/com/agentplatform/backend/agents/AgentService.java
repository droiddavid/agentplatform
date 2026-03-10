package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.AgentCreateRequest;
import com.agentplatform.backend.agents.dto.AgentResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public AgentResponse createAgent(Long ownerId, AgentCreateRequest req) {
        var a = new Agent(ownerId, req.getName(), req.getDescription());
        var saved = agentRepository.save(a);
        return map(saved);
    }

    public List<AgentResponse> listByOwner(Long ownerId) {
        return agentRepository.findByOwnerId(ownerId).stream().map(this::map).collect(Collectors.toList());
    }

    public AgentResponse getByIdForOwner(Long ownerId, Long agentId) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return null;
        return map(opt.get());
    }

    public void deleteByIdForOwner(Long ownerId, Long agentId) {
        var opt = agentRepository.findById(agentId);
        if (opt.isPresent() && opt.get().getOwnerId().equals(ownerId)) {
            agentRepository.deleteById(agentId);
        }
    }

    public AgentResponse updateAgent(Long ownerId, Long agentId, AgentCreateRequest req) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return null;
        var a = opt.get();
        if (req.getName() != null) a.setName(req.getName());
        if (req.getDescription() != null) a.setDescription(req.getDescription());
        a.setUpdatedAt(java.time.Instant.now());
        var saved = agentRepository.save(a);
        return map(saved);
    }

    private AgentResponse map(Agent a) {
        return new AgentResponse(a.getId(), a.getOwnerId(), a.getName(), a.getDescription(), a.getStatus(), a.getVisibility(), a.getCreatedAt());
    }
}
