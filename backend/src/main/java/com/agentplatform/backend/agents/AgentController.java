package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.AgentCreateRequest;
import com.agentplatform.backend.agents.dto.AgentResponse;
import com.agentplatform.backend.auth.jwt.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;
    private final JwtUtil jwtUtil;

    public AgentController(AgentService agentService, JwtUtil jwtUtil) {
        this.agentService = agentService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<AgentResponse> create(@RequestBody AgentCreateRequest req, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = agentService.createAgent(userId, req);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<AgentResponse>> list(Authentication auth) {
        Long userId = parseUserId(auth);
        return ResponseEntity.ok(agentService.listByOwner(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = agentService.getByIdForOwner(userId, id);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        Long userId = parseUserId(auth);
        agentService.deleteByIdForOwner(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AgentCreateRequest req, Authentication auth) {
        Long userId = parseUserId(auth);
        var res = agentService.updateAgent(userId, id, req);
        if (res == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(res);
    }

    private Long parseUserId(Authentication auth) {
        if (auth == null) throw new IllegalStateException("Not authenticated");
        try {
            // authentication principal may be email or id string
            var principal = auth.getPrincipal();
            if (principal instanceof String) {
                String p = (String) principal;
                // try parse long, otherwise lookup user by email would be needed; jwt filter sets email or id
                try { return Long.parseLong(p); } catch (Exception e) { return jwtUtil.parseUserIdFromToken((String)auth.getDetails()); }
            }
        } catch (Exception e) {}
        throw new IllegalStateException("Unable to determine current user id");
    }
}
