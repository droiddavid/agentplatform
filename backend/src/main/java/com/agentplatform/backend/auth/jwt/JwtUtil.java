package com.agentplatform.backend.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import io.jsonwebtoken.Claims;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access.token.expiry.seconds:900}")
    private long accessExpirySeconds;

    private SecretKey key;

    @PostConstruct
    public void init() {
        // In production, use a proper secret key management
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateAccessToken(Long userId, String email) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + accessExpirySeconds * 1000L);
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("email", email)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long parseUserIdFromToken(String token) {
        if (token == null) return null;
        if (token.startsWith("Bearer ")) token = token.substring(7);
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            String sub = claims.getSubject();
            return sub == null ? null : Long.parseLong(sub);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JWT token");
        }
    }

    public String parseEmailFromToken(String token) {
        if (token == null) return null;
        if (token.startsWith("Bearer ")) token = token.substring(7);
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return claims.get("email", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}
