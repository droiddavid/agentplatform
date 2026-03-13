package com.agentplatform.backend.templates.dto;

import java.time.Instant;

public class TemplateCategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private Integer displayOrder;
    private Instant createdAt;

    public TemplateCategoryResponse() {}

    public TemplateCategoryResponse(Long id, String name, String description, String icon, Integer displayOrder, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getIcon() { return icon; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Instant getCreatedAt() { return createdAt; }
}
