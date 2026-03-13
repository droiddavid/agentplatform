package com.agentplatform.backend.templates;

import com.agentplatform.backend.templates.dto.TemplateCategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateCategoryService {
    private final TemplateCategoryRepository repo;

    public TemplateCategoryService(TemplateCategoryRepository repo) {
        this.repo = repo;
    }

    public List<TemplateCategoryResponse> listAll() {
        return repo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TemplateCategoryResponse get(Long id) {
        return repo.findById(id).map(this::mapToResponse).orElse(null);
    }

    public TemplateCategoryResponse getByName(String name) {
        return repo.findByName(name).map(this::mapToResponse).orElse(null);
    }

    private TemplateCategoryResponse mapToResponse(TemplateCategory category) {
        return new TemplateCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIcon(),
                category.getDisplayOrder(),
                category.getCreatedAt()
        );
    }
}
