package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.SignUpRequest;
import com.agentplatform.backend.auth.jwt.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.agentplatform.backend.audit.AuditEventRepository dummyForCompile; // placeholder to ensure package import resolution
    private final com.agentplatform.backend.audit.AuditService auditService;

    @org.springframework.beans.factory.annotation.Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, com.agentplatform.backend.audit.AuditService auditService, com.agentplatform.backend.audit.AuditEventRepository dummyForCompile) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
        this.dummyForCompile = dummyForCompile;
    }

    // Backwards-compatible constructor for unit tests and simple wiring
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this(userRepository, passwordEncoder, new com.agentplatform.backend.audit.AuditService(null), null);
    }

    public User signUp(SignUpRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        String hash = passwordEncoder.encode(req.getPassword());
        User u = new User(req.getEmail(), hash);
        return userRepository.save(u);
    }

    public SignInResult signIn(String email, String password, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, long refreshExpirySeconds) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new IllegalArgumentException("Invalid credentials");
        var user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) throw new IllegalArgumentException("Invalid credentials");

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        // create refresh token
        String refreshToken = java.util.UUID.randomUUID().toString();
        java.time.Instant expires = java.time.Instant.now().plusSeconds(refreshExpirySeconds);
        var rt = new RefreshToken(refreshToken, user.getId(), expires);
        refreshTokenRepository.save(rt);
        try { auditService.record(user.getId(), "REFRESH_ISSUED", "issued refresh for user"); } catch (Exception ignored) {}

        return new SignInResult(accessToken, refreshToken);
    }

    public SignInResult refreshWithRotation(String refreshToken, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, long refreshExpirySeconds) {
        var rtOpt = refreshTokenRepository.findByToken(refreshToken);
        if (rtOpt.isEmpty()) throw new IllegalArgumentException("Invalid refresh token");
        var rt = rtOpt.get();
        if (rt.getExpiresAt().isBefore(java.time.Instant.now())) {
            // expired - remove
            refreshTokenRepository.delete(rt);
            throw new IllegalArgumentException("Refresh token expired");
        }

        var userOpt = userRepository.findById(rt.getUserId());
        if (userOpt.isEmpty()) {
            refreshTokenRepository.delete(rt);
            throw new IllegalArgumentException("Invalid refresh token (user not found)");
        }
        var user = userOpt.get();

        String newAccess = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        // rotate refresh token: delete old and save a new one
        refreshTokenRepository.delete(rt);
        String newRefresh = java.util.UUID.randomUUID().toString();
        java.time.Instant expires = java.time.Instant.now().plusSeconds(refreshExpirySeconds);
        var newRt = new RefreshToken(newRefresh, user.getId(), expires);
        refreshTokenRepository.save(newRt);
        try { auditService.record(user.getId(), "REFRESH_ROTATED", "rotated refresh token"); } catch (Exception ignored) {}

        return new SignInResult(newAccess, newRefresh);
    }

    public void revokeRefreshToken(String refreshToken, RefreshTokenRepository refreshTokenRepository) {
        var rtOpt = refreshTokenRepository.findByToken(refreshToken);
        rtOpt.ifPresent(r -> { refreshTokenRepository.delete(r); try { auditService.record(r.getUserId(), "REFRESH_REVOKED", "revoked refresh token"); } catch (Exception ignored) {} });
    }

    public static class SignInResult {
        public final String accessToken;
        public final String refreshToken;
        public SignInResult(String a, String r) { this.accessToken = a; this.refreshToken = r; }
    }
}
