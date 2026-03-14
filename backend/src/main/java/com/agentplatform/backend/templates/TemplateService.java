package com.agentplatform.backend.templates;

import com.agentplatform.backend.templates.dto.TemplateCategoryResponse;
import com.agentplatform.backend.templates.dto.TemplateResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {
    private final TemplateRepository repo;
    private final TemplateCategoryRepository categoryRepo;

    public TemplateService(TemplateRepository repo, TemplateCategoryRepository categoryRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
    }

    public List<TemplateResponse> listAll() {
        return repo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TemplateResponse get(Long id) {
        return repo.findById(id).map(this::mapToResponse).orElse(null);
    }

    public List<TemplateResponse> listByCategory(Long categoryId) {
        return categoryRepo.findById(categoryId)
                .map(category -> repo.findByCategory(category)
                        .stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    private TemplateResponse mapToResponse(Template template) {
        TemplateCategoryResponse categoryResponse = null;
        if (template.getCategory() != null) {
            categoryResponse = new TemplateCategoryResponse(
                    template.getCategory().getId(),
                    template.getCategory().getName(),
                    template.getCategory().getDescription(),
                    template.getCategory().getIcon(),
                    template.getCategory().getDisplayOrder(),
                    template.getCategory().getCreatedAt()
            );
        }
        return new TemplateResponse(
                template.getId(),
                template.getName(),
                template.getDescription(),
                template.getContent(),
                categoryResponse,
                template.getCreatedAt()
        );
    }
}
