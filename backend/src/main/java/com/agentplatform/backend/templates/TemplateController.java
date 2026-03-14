package com.agentplatform.backend.templates;

import com.agentplatform.backend.templates.dto.TemplateCategoryResponse;
import com.agentplatform.backend.templates.dto.TemplateResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    private final TemplateService service;
    private final TemplateCategoryService categoryService;

    public TemplateController(TemplateService service, TemplateCategoryService categoryService) {
        this.service = service;
        this.categoryService = categoryService;
    }

    // Template endpoints
    @GetMapping
    public List<TemplateResponse> list() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public TemplateResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<TemplateResponse> listByCategory(@PathVariable Long categoryId) {
        return service.listByCategory(categoryId);
    }

    // Category endpoints
    @GetMapping("/categories/all")
    public List<TemplateCategoryResponse> listCategories() {
        return categoryService.listAll();
    }

    @GetMapping("/categories/{id}")
    public TemplateCategoryResponse getCategory(@PathVariable Long id) {
        return categoryService.get(id);
    }
}
