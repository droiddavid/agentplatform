package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.SignUpRequest;
import com.agentplatform.backend.auth.dto.SignUpResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.agentplatform.backend.auth.jwt.JwtUtil;
import com.agentplatform.backend.auth.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import com.agentplatform.backend.auth.dto.RefreshRequest;
import com.agentplatform.backend.auth.dto.RefreshResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshExpirySeconds;

    public AuthController(AuthService authService, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, @Value("${jwt.refresh.token.expiry.seconds:1209600}") long refreshExpirySeconds) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirySeconds = refreshExpirySeconds;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> signUp(@RequestBody SignUpRequest req) {
        var user = authService.signUp(req);
        return ResponseEntity.ok(new SignUpResponse(user.getId(), user.getEmail()));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignUpRequest req) {
        // lightweight signin using email/password. Returns access and refresh tokens.
        var result = authService.signIn(req.getEmail(), req.getPassword(), jwtUtil, refreshTokenRepository, refreshExpirySeconds);
        return ResponseEntity.ok(java.util.Map.of(
            "accessToken", result.accessToken,
            "refreshToken", result.refreshToken
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@RequestBody RefreshRequest req) {
        var result = authService.refreshWithRotation(req.getRefreshToken(), jwtUtil, refreshTokenRepository, refreshExpirySeconds);
        return ResponseEntity.ok(new RefreshResponse(result.accessToken, result.refreshToken));
    }
}
