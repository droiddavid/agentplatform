package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    private final AgentRepository agentRepository;
    private final AgentCapabilityRepository capabilityRepository;
    private final AgentToolPermissionRepository toolPermissionRepository;
    private final AgentPolicyRepository policyRepository;
    private final AgentRelationshipRepository relationshipRepository;

    public AgentService(AgentRepository agentRepository,
                        AgentCapabilityRepository capabilityRepository,
                        AgentToolPermissionRepository toolPermissionRepository,
                        AgentPolicyRepository policyRepository,
                        AgentRelationshipRepository relationshipRepository) {
        this.agentRepository = agentRepository;
        this.capabilityRepository = capabilityRepository;
        this.toolPermissionRepository = toolPermissionRepository;
        this.policyRepository = policyRepository;
        this.relationshipRepository = relationshipRepository;
    }

    // Agent CRUD
    public AgentResponse createAgent(Long ownerId, AgentCreateRequest req) {
        var a = new Agent(ownerId, req.getName(), req.getDescription());
        if (req.getTemplateId() != null) a.setTemplateId(req.getTemplateId());
        if (req.getModelPreference() != null) a.setModelPreference(req.getModelPreference());
        if (req.getInstructions() != null) a.setInstructions(req.getInstructions());
        if (req.getSystemPrompt() != null) a.setSystemPrompt(req.getSystemPrompt());
        var saved = agentRepository.save(a);
        
        // Create capabilities from wizard data
        if (req.getCapabilities() != null && !req.getCapabilities().isEmpty()) {
            for (String capName : req.getCapabilities()) {
                var cap = new AgentCapability(saved, capName, "Added from wizard");
                capabilityRepository.save(cap);
            }
        }
        
        // Create tool permissions from wizard data
        if (req.getAllowedTools() != null && !req.getAllowedTools().isEmpty()) {
            for (String toolName : req.getAllowedTools()) {
                var perm = new AgentToolPermission(saved, toolName, "execute", 
                    req.getApproveEveryAction() != null ? req.getApproveEveryAction() : false);
                toolPermissionRepository.save(perm);
            }
        }
        
        // Create policies from wizard data
        if (req.getApproveEveryAction() != null && req.getApproveEveryAction()) {
            var policy = new AgentPolicy(saved, "approveEveryAction", "true");
            policyRepository.save(policy);
        }
        if (req.getRememberApprovals() != null && req.getRememberApprovals()) {
            var policy = new AgentPolicy(saved, "rememberApprovals", "true");
            policyRepository.save(policy);
        }
        if (req.getEnableMemory() != null) {
            var policy = new AgentPolicy(saved, "enableMemory", req.getEnableMemory().toString());
            policyRepository.save(policy);
        }
        if (req.getMemoryType() != null) {
            var policy = new AgentPolicy(saved, "memoryType", req.getMemoryType());
            policyRepository.save(policy);
        }
        
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
        if (req.getTemplateId() != null) a.setTemplateId(req.getTemplateId());
        if (req.getModelPreference() != null) a.setModelPreference(req.getModelPreference());
        if (req.getInstructions() != null) a.setInstructions(req.getInstructions());
        if (req.getSystemPrompt() != null) a.setSystemPrompt(req.getSystemPrompt());
        a.setUpdatedAt(Instant.now());
        var saved = agentRepository.save(a);
        return map(saved);
    }

    // Capability management
    public AgentCapabilityResponse addCapability(Long ownerId, Long agentId, String name, String description) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return null;
        var cap = new AgentCapability(opt.get(), name, description);
        var saved = capabilityRepository.save(cap);
        return mapCapability(saved);
    }

    public List<AgentCapabilityResponse> listCapabilities(Long ownerId, Long agentId) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return List.of();
        return capabilityRepository.findByAgent(opt.get()).stream()
                .map(this::mapCapability).collect(Collectors.toList());
    }

    public void removeCapability(Long ownerId, Long agentId, Long capabilityId) {
        var opt = agentRepository.findById(agentId);
        if (opt.isPresent() && opt.get().getOwnerId().equals(ownerId)) {
            capabilityRepository.deleteById(capabilityId);
        }
    }

    // Tool permission management
    public AgentToolPermissionResponse addToolPermission(Long ownerId, Long agentId, String toolName, String permLevel, Boolean requiresApproval) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return null;
        var perm = new AgentToolPermission(opt.get(), toolName, permLevel, requiresApproval);
        var saved = toolPermissionRepository.save(perm);
        return mapToolPermission(saved);
    }

    public List<AgentToolPermissionResponse> listToolPermissions(Long ownerId, Long agentId) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return List.of();
        return toolPermissionRepository.findByAgent(opt.get()).stream()
                .map(this::mapToolPermission).collect(Collectors.toList());
    }

    // Policy management
    public AgentPolicyResponse addPolicy(Long ownerId, Long agentId, String policyName, String policyValue) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return null;
        var policy = new AgentPolicy(opt.get(), policyName, policyValue);
        var saved = policyRepository.save(policy);
        return mapPolicy(saved);
    }

    public List<AgentPolicyResponse> listPolicies(Long ownerId, Long agentId) {
        var opt = agentRepository.findById(agentId);
        if (opt.isEmpty() || !opt.get().getOwnerId().equals(ownerId)) return List.of();
        return policyRepository.findByAgent(opt.get()).stream()
                .map(this::mapPolicy).collect(Collectors.toList());
    }

    // Mapping functions
    private AgentResponse map(Agent a) {
        var resp = new AgentResponse(a.getId(), a.getOwnerId(), a.getName(), a.getDescription(), a.getStatus(), a.getVisibility(), a.getCreatedAt());
        resp.setTemplateId(a.getTemplateId());
        resp.setModelPreference(a.getModelPreference());
        resp.setInstructions(a.getInstructions());
        resp.setSystemPrompt(a.getSystemPrompt());
        resp.setUpdatedAt(a.getUpdatedAt());
        
        if (a.getCapabilities() != null) {
            resp.setCapabilities(a.getCapabilities().stream().map(this::mapCapability).collect(Collectors.toList()));
        }
        if (a.getToolPermissions() != null) {
            resp.setToolPermissions(a.getToolPermissions().stream().map(this::mapToolPermission).collect(Collectors.toList()));
        }
        if (a.getPolicies() != null) {
            resp.setPolicies(a.getPolicies().stream().map(this::mapPolicy).collect(Collectors.toList()));
        }
        
        return resp;
    }

    private AgentCapabilityResponse mapCapability(AgentCapability c) {
        return new AgentCapabilityResponse(c.getId(), c.getCapabilityName(), c.getDescription(), c.getEnabled(), c.getCreatedAt());
    }

    private AgentToolPermissionResponse mapToolPermission(AgentToolPermission p) {
        return new AgentToolPermissionResponse(p.getId(), p.getToolName(), p.getPermissionLevel(), p.getRequiresApproval(), p.getCreatedAt());
    }

    private AgentPolicyResponse mapPolicy(AgentPolicy p) {
        return new AgentPolicyResponse(p.getId(), p.getPolicyName(), p.getPolicyValue(), p.getCreatedAt());
    }
}
