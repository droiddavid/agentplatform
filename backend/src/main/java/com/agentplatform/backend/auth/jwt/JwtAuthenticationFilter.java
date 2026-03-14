package com.agentplatform.backend.auth.jwt;

import com.agentplatform.backend.auth.RoleRepository;
import com.agentplatform.backend.auth.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository, RoleRepository roleRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = null;
        try {
            authHeader = request.getHeader("Authorization");
            log.debug("JWT Filter - Authorization header: {}", authHeader != null ? "present" : "missing");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String rawToken = authHeader.substring(7);
                log.debug("JWT Filter - Parsing token from header, token prefix: {}...", rawToken.substring(0, Math.min(20, rawToken.length())));
                
                try {
                    Long userId = jwtUtil.parseUserIdFromToken(authHeader);
                    log.info("JWT Filter - User ID parsed successfully: {}", userId);
                    
                    if (userId != null) {
                        log.info("JWT Filter - User ID: {}, looking up in database", userId);
                        var userOpt = userRepository.findById(userId);
                        if (userOpt.isPresent()) {
                            log.info("JWT Filter - User found in database: {}", userOpt.get().getEmail());
                            String email = jwtUtil.parseEmailFromToken(authHeader);
                            log.info("JWT Filter - Email parsed from token: {}", email);
                            
                            var roles = roleRepository.findByUserId(userId);
                            log.info("JWT Filter - Found {} roles for user {}", roles.size(), userId);
                            roles.forEach(r -> log.info("JWT Filter - Role: {}", r.getName()));
                            
                            List<SimpleGrantedAuthority> authorities = roles.stream()
                                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                                    .collect(Collectors.toList());
                            
                            // If no roles, grant a default USER role
                            if (authorities.isEmpty()) {
                                log.info("JWT Filter - No roles found, granting default ROLE_USER");
                                authorities = new java.util.ArrayList<>();
                                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                            }
                            
                            log.info("JWT Filter - Created {} authorities: {}", authorities.size(), authorities.stream().map(SimpleGrantedAuthority::getAuthority).collect(Collectors.toList()));

                            // Create token with authorities - Spring automatically sets authenticated=true when authorities are provided
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email != null ? email : userId.toString(), null, authorities);
                            auth.setDetails(authHeader);
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            log.info("JWT Filter - Authentication set - Principal: {}, Authenticated: {}, Authorities: {}", auth.getPrincipal(), auth.isAuthenticated(), auth.getAuthorities());
                        } else {
                            log.warn("JWT Filter - User not found in database: {}", userId);
                        }
                    } else {
                        log.warn("JWT Filter - Could not parse user ID from token");
                    }
                } catch (IllegalArgumentException e) {
                    log.error("JWT Filter - Invalid token: {}", e.getMessage());
                    filterChain.doFilter(request, response);
                    return;
                } catch (Exception e) {
                    log.error("JWT Filter - Token validation failed: {} - {}", e.getClass().getSimpleName(), e.getMessage());
                    filterChain.doFilter(request, response);
                    return;
                }
            } else {
                log.debug("JWT Filter - No Bearer token in header, path: {}", request.getRequestURI());
            }
        } catch (Exception e) {
            log.error("JWT Filter - Unexpected error in filter: {} - {}", e.getClass().getSimpleName(), e.getMessage(), e);
        }
        filterChain.doFilter(request, response);
    }
}
