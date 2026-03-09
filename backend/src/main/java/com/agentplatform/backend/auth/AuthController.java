package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.SignUpRequest;
import com.agentplatform.backend.auth.dto.SignUpResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> signUp(@RequestBody SignUpRequest req) {
        var user = authService.signUp(req);
        return ResponseEntity.ok(new SignUpResponse(user.getId(), user.getEmail()));
    }
}
