package com.agentplatform.backend.auth.dto;

public class SignUpResponse {
    private Long id;
    private String email;

    public SignUpResponse() {}

    public SignUpResponse(Long id, String email) {
        this.id = id;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
}
