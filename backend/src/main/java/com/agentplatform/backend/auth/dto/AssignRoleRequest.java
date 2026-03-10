package com.agentplatform.backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public class AssignRoleRequest {

    @NotNull
    private Long userId;

    @NotNull
    private String roleName;

    public AssignRoleRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
}
