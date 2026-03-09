package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.SignUpRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceUnitTest {

    private UserRepository userRepository;
    private AuthService authService;

    @BeforeEach
    public void setup() {
        userRepository = Mockito.mock(UserRepository.class);
        var encoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, encoder);
    }

    @Test
    public void signUp_createsUser_whenEmailNotExists() {
        var req = new SignUpRequest();
        req.setEmail("u1@example.com");
        req.setPassword("Password123!");

        Mockito.when(userRepository.existsByEmail("u1@example.com")).thenReturn(false);
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(i -> i.getArgument(0));

        User u = authService.signUp(req);

        assertNotNull(u);
        assertEquals("u1@example.com", u.getEmail());
        assertNotNull(u.getPasswordHash());
        assertTrue(u.getPasswordHash().length() > 0);
    }

    @Test
    public void signUp_throws_whenEmailExists() {
        var req = new SignUpRequest();
        req.setEmail("exists@example.com");
        req.setPassword("abc");

        Mockito.when(userRepository.existsByEmail("exists@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.signUp(req));
    }
}
