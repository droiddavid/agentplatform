package com.agentplatform.backend.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import io.jsonwebtoken.Claims;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access.token.expiry.seconds:900}")
    private long accessExpirySeconds;

    private SecretKey key;

    @PostConstruct
    public void init() {
        // In production, use a proper secret key management
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        log.info("JwtUtil initialized - secret key length: {} bytes", jwtSecret.length());
    }

    public String generateAccessToken(Long userId, String email) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + accessExpirySeconds * 1000L);
        String token = Jwts.builder()
                .setSubject(userId.toString())
                .claim("email", email)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        log.info("generateAccessToken - created token for userId: {}, email: {}, expires in: {} seconds", userId, email, accessExpirySeconds);
        return token;
    }

    public Long parseUserIdFromToken(String token) {
        if (token == null) {
            log.warn("parseUserIdFromToken - token is null");
            return null;
        }
        
        String rawToken = token;
        if (token.startsWith("Bearer ")) {
            rawToken = token.substring(7);
        }
        
        try {
            log.debug("parseUserIdFromToken - parsing token (length: {})", rawToken.length());
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(rawToken).getPayload();
            String sub = claims.getSubject();
            log.info("parseUserIdFromToken - successfully parsed, subject: {}", sub);
            return sub == null ? null : Long.parseLong(sub);
        } catch (Exception e) {
            log.error("parseUserIdFromToken - JWT parsing failed: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new IllegalArgumentException("Invalid JWT token: " + e.getMessage());
        }
    }

    public String parseEmailFromToken(String token) {
        if (token == null) {
            log.warn("parseEmailFromToken - token is null");
            return null;
        }
        
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            String email = claims.get("email", String.class);
            log.debug("parseEmailFromToken - successfully parsed email: {}", email);
            return email;
        } catch (Exception e) {
            log.error("parseEmailFromToken - JWT parsing failed: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }
}
