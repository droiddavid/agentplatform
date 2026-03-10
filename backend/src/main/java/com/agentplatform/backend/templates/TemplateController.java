package com.agentplatform.backend.templates;

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

    public TemplateController(TemplateService service) {
        this.service = service;
    }

    @GetMapping
    public List<TemplateResponse> list() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public TemplateResponse get(@PathVariable Long id) {
        return service.get(id);
    }
}
