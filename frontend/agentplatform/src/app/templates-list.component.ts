import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TemplateService, TemplateResponse, TemplateCategoryResponse } from './services/template.service';
import { PageHeaderComponent } from './shared/components/page-header.component';
import { EmptyStateComponent } from './shared/components/empty-state.component';
import { LoadingStateComponent } from './shared/components/loading-state.component';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, EmptyStateComponent, LoadingStateComponent],
  template: `
    <app-page-header 
      title="Templates" 
      subtitle="Browse and use pre-built agent templates">
    </app-page-header>

    <!-- Category Filter -->
    @if (categories() && categories()!.length > 0) {
      <div class="category-filter">
        <button 
          class="category-btn all-btn"
          [class.active]="selectedCategoryId() === null"
          (click)="selectCategory(null)">
          All Templates
        </button>
        @for (cat of categories(); track cat.id) {
          <button 
            class="category-btn"
            [class.active]="selectedCategoryId() === cat.id"
            (click)="selectCategory(cat.id)">
            <span class="icon">{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
        }
      </div>
    }

    @if (!templates() || !categories()) {
      <app-loading-state message="Loading templates..."></app-loading-state>
    }

    @if (templates() && filteredTemplates() && filteredTemplates()!.length === 0) {
      <app-empty-state icon="📋" title="No templates in this category" message="Try selecting a different category or create a custom agent.">
        <a routerLink="/agents/wizard" class="btn btn-primary">Create Custom Agent</a>
      </app-empty-state>
    }

    @if (filteredTemplates() && filteredTemplates()!.length > 0) {
      <div class="templates-grid">
        @for (template of filteredTemplates(); track template.id) {
          <div class="template-card">
            <div class="template-header">
              <div class="template-icon">{{ template.category?.icon || '⚙️' }}</div>
              <div class="template-category">{{ template.category?.name || 'General' }}</div>
            </div>
            <h3>{{ template.name }}</h3>
            <p class="description">{{ template.description }}</p>
            <button class="btn btn-primary" (click)="useTemplate(template)">Use Template</button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .category-filter {
      display: flex;
      gap: 0.75rem;
      padding: 1.5rem;
      overflow-x: auto;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      color: #666;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .category-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .category-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .category-btn .icon {
      margin-right: 0.5rem;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .template-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .template-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .template-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      justify-content: center;
    }

    .template-icon {
      font-size: 2rem;
    }

    .template-category {
      font-size: 0.75rem;
      background: #f0f0f0;
      color: #666;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .template-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .template-card p.description {
      margin: 0 0 1rem auto;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      flex-grow: 1;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      width: 100%;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      margin-top: auto;
    }

    .btn-primary:hover {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    @media (max-width: 768px) {
      .templates-grid {
        grid-template-columns: 1fr;
      }

      .category-filter {
        padding: 1rem;
        gap: 0.5rem;
      }

      .category-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class TemplatesListComponent {
  private svc = inject(TemplateService);
  private router = inject(Router);

  templates = signal<TemplateResponse[] | null>(null);
  categories = signal<TemplateCategoryResponse[] | null>(null);
  selectedCategoryId = signal<number | null>(null);

  filteredTemplates = computed(() => {
    const templates = this.templates();
    const categoryId = this.selectedCategoryId();
    
    if (!templates) return null;
    
    if (categoryId === null) {
      return templates;
    }
    
    return templates.filter(t => t.category?.id === categoryId);
  });

  constructor() {
    this.load();
  }

  load() {
    this.svc.listCategories().subscribe(cats => this.categories.set(cats));
    this.svc.list().subscribe(list => this.templates.set(list));
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
  }

  useTemplate(template: TemplateResponse) {
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    this.router.navigateByUrl('/agents/wizard');
  }
}
