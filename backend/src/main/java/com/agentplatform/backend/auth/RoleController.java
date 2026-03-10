package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.AssignRoleRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/roles")
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) { this.roleService = roleService; }

    @PostMapping("/assign")
    public ResponseEntity<?> assign(@RequestBody AssignRoleRequest req) {
        roleService.assignRoleToUser(req.getUserId(), req.getRoleName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove")
    public ResponseEntity<?> remove(@RequestBody AssignRoleRequest req) {
        roleService.removeRoleFromUser(req.getUserId(), req.getRoleName());
        return ResponseEntity.ok().build();
    }
}
