package com.agentplatform.backend.templates;

import com.agentplatform.backend.templates.dto.TemplateResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {
    private final TemplateRepository repo;

    public TemplateService(TemplateRepository repo) {
        this.repo = repo;
    }

    public List<TemplateResponse> listAll() {
        return repo.findAll().stream()
                .map(t -> new TemplateResponse(t.getId(), t.getName(), t.getDescription(), t.getCategory(), t.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public TemplateResponse get(Long id) {
        return repo.findById(id).map(t -> new TemplateResponse(t.getId(), t.getName(), t.getDescription(), t.getCategory(), t.getCreatedAt())).orElse(null);
    }
}
