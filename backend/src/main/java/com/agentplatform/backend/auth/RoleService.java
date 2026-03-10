package com.agentplatform.backend.auth;

import org.springframework.stereotype.Service;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public RoleService(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    public Role ensureRole(String name) {
        return roleRepository.findByName(name).orElseGet(() -> roleRepository.save(new Role(name)));
    }
    @org.springframework.transaction.annotation.Transactional
    public void assignRoleToUser(Long userId, String roleName) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) throw new IllegalArgumentException("User not found");
        Role role = ensureRole(roleName);
        // insert into join table via native query or JPA relationship; use native insert
        userRepository.assignRole(userId, role.getId());
    }

    @org.springframework.transaction.annotation.Transactional
    public void removeRoleFromUser(Long userId, String roleName) {
        var roleOpt = roleRepository.findByName(roleName);
        if (roleOpt.isEmpty()) return;
        userRepository.removeRole(userId, roleOpt.get().getId());
    }
}
