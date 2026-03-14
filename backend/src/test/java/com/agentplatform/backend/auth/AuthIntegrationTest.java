package com.agentplatform.backend.auth;

import com.agentplatform.backend.auth.dto.SignUpRequest;
import com.agentplatform.backend.auth.dto.RefreshRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Disabled("Requires Docker/Testcontainers — enable in CI or local Docker environment")
public class AuthIntegrationTest {

    // This integration test uses Testcontainers when enabled. It is disabled by default
    // to avoid failing local builds where Docker/Testcontainers are not available.

    @LocalServerPort
    private int port;

    private RestTemplate restTemplate = new RestTemplate();

    @Test
    void signup_signin_refresh_logout_flow() {
        // signup
        var signup = new SignUpRequest();
        signup.setEmail("it_user@example.com");
        signup.setPassword("s3cretpass");

        ResponseEntity<Map<String, Object>> signupResp = restTemplate.exchange(
            "http://localhost:" + port + "/api/auth/signup",
            HttpMethod.POST,
            new HttpEntity<>(signup),
            new ParameterizedTypeReference<Map<String, Object>>(){}
        );
        assertThat(signupResp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(signupResp.getBody()).containsKeys("id", "email");

        // signin
        ResponseEntity<Map<String, Object>> signinResp = restTemplate.exchange(
            "http://localhost:" + port + "/api/auth/signin",
            HttpMethod.POST,
            new HttpEntity<>(signup),
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        assertThat(signinResp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(signinResp.getBody()).containsKeys("accessToken", "refreshToken");

        String refreshToken = (String) signinResp.getBody().get("refreshToken");

        // refresh
        var refreshReq = new RefreshRequest();
        refreshReq.setRefreshToken(refreshToken);
        ResponseEntity<Map<String, Object>> refreshResp = restTemplate.exchange(
            "http://localhost:" + port + "/api/auth/refresh",
            HttpMethod.POST,
            new HttpEntity<>(refreshReq),
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        assertThat(refreshResp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(refreshResp.getBody()).containsKeys("accessToken", "refreshToken");

        // logout (revoke token)
        var logoutReq = new RefreshRequest();
        logoutReq.setRefreshToken((String) refreshResp.getBody().get("refreshToken"));
        ResponseEntity<Void> logoutResp = restTemplate.postForEntity("http://localhost:" + port + "/api/auth/logout", logoutReq, Void.class);
        assertThat(logoutResp.getStatusCode().is2xxSuccessful()).isTrue();

        // attempt to refresh again using revoked token -> should be unauthorized or error
        ResponseEntity<Map<String, Object>> refreshAfterLogout = restTemplate.exchange(
            "http://localhost:" + port + "/api/auth/refresh",
            HttpMethod.POST,
            new HttpEntity<>(logoutReq),
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        assertThat(refreshAfterLogout.getStatusCode().value()).isGreaterThanOrEqualTo(400);
    }
}
