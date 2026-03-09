package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.SignUpRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signUp(SignUpRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        String hash = passwordEncoder.encode(req.getPassword());
        User u = new User(req.getEmail(), hash);
        return userRepository.save(u);
    }
}
