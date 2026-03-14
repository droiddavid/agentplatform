package com.agentplatform.backend.templates.dto;

import java.time.Instant;

public class TemplateResponse {
    private Long id;
    private String name;
    private String description;
    private String content;
    private TemplateCategoryResponse category;
    private Instant createdAt;

    public TemplateResponse() {}

    public TemplateResponse(Long id, String name, String description, String content, TemplateCategoryResponse category, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.content = content;
        this.category = category;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getContent() { return content; }
    public TemplateCategoryResponse getCategory() { return category; }
    public Instant getCreatedAt() { return createdAt; }
}
