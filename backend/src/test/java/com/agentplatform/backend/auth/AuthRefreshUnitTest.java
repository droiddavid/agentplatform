package com.agentplatform.backend.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class AuthRefreshUnitTest {

    private UserRepository userRepository;
    private RefreshTokenRepository refreshTokenRepository;
    private AuthService authService;

    @BeforeEach
    public void setup() {
        userRepository = Mockito.mock(UserRepository.class);
        refreshTokenRepository = Mockito.mock(RefreshTokenRepository.class);
        var encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        authService = new AuthService(userRepository, encoder);
    }

    @Test
    public void refresh_rotatesTokens_andReturnsNewAccessAndRefresh() {
        var user = new User("u@example.com", "hash");
        // set id via reflection to mimic persisted entity
        try { java.lang.reflect.Field idf = User.class.getDeclaredField("id"); idf.setAccessible(true); idf.set(user, 1L); } catch (Exception e) { }

        var oldRt = new RefreshToken("oldtoken", 1L, Instant.now().plusSeconds(3600));

        Mockito.when(refreshTokenRepository.findByToken("oldtoken")).thenReturn(Optional.of(oldRt));
        Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Mockito.when(refreshTokenRepository.save(Mockito.any(RefreshToken.class))).thenAnswer(i -> i.getArgument(0));

        var jwtUtil = Mockito.mock(com.agentplatform.backend.auth.jwt.JwtUtil.class);
        Mockito.when(jwtUtil.generateAccessToken(1L, "u@example.com")).thenReturn("newAccessToken");

        var res = authService.refreshWithRotation("oldtoken", jwtUtil, refreshTokenRepository, 1209600L);

        assertNotNull(res);
        assertEquals("newAccessToken", res.accessToken);
        assertNotEquals("oldtoken", res.refreshToken);
        assertTrue(res.refreshToken.length() > 10);
        Mockito.verify(refreshTokenRepository).delete(oldRt);
        Mockito.verify(refreshTokenRepository).save(Mockito.any(RefreshToken.class));
    }
}
