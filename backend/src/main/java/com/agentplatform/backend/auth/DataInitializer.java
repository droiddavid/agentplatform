package com.agentplatform.backend.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements ApplicationRunner {

    private final RoleService roleService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoleService roles;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Value("${admin.seed.email:}")
    private String adminEmail;

    @Value("${admin.seed.password:}")
    private String adminPassword;

    public DataInitializer(RoleService roleService, UserRepository userRepository, RoleRepository roleRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.roleService = roleService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.roles = roleService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // ensure basic roles exist
        roleService.ensureRole("ADMIN");
        roleService.ensureRole("USER");

        // seed admin user if properties provided and user doesn't exist
        if (adminEmail != null && !adminEmail.isBlank() && adminPassword != null && !adminPassword.isBlank()) {
            if (!userRepository.existsByEmail(adminEmail)) {
                var user = new User(adminEmail, passwordEncoder.encode(adminPassword));
                userRepository.save(user);
                // assign ADMIN role if possible; be defensive in early test environments
                try {
                    var adminRole = roleRepository.findByName("ADMIN").orElseThrow();
                    userRepository.assignRole(user.getId(), adminRole.getId());
                } catch (Exception e) {
                    System.err.println("Warning: could not assign ADMIN role at startup: " + e.getMessage());
                }
            }
        }
    }
}
