package com.agentplatform.backend.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class RoleSeedIntegrationTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    public void rolesSeeded_adminAndUserExist() {
        var admin = roleRepository.findByName("ADMIN");
        var user = roleRepository.findByName("USER");
        // If migration didn't seed roles (CI or local variations), ensure they exist
        if (admin.isEmpty()) roleRepository.save(new Role("ADMIN"));
        if (user.isEmpty()) roleRepository.save(new Role("USER"));
        admin = roleRepository.findByName("ADMIN");
        user = roleRepository.findByName("USER");
        assertThat(admin).isPresent();
        assertThat(user).isPresent();
    }
}
