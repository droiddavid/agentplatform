import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TemplateService, TemplateResponse } from './services/template.service';
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
      subtitle="Start with a template or create an agent from scratch">
    </app-page-header>

    @if (!templates()) {
      <app-loading-state message="Loading templates..."></app-loading-state>
    }

    @if (templates() && templates()!.length === 0) {
      <app-empty-state icon="📋" title="No templates available" message="Templates will be added soon.">
        <a routerLink="/agents/wizard" class="btn btn-primary">Create Agent with Wizard</a>
      </app-empty-state>
    }

    @if (templates() && templates()!.length > 0) {
      <div class="templates-grid">
        @for (template of templates(); track template.id) {
          <div class="template-card">
            <div class="template-icon">📋</div>
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <button class="btn btn-primary" (click)="useTemplate(template)">Use Template</button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
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
    }

    .template-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .template-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .template-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .template-card p {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
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
    }

    .btn-primary:hover {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    @media (max-width: 768px) {
      .templates-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TemplatesListComponent {
  private svc = inject(TemplateService);
  private router = inject(Router);

  templates = signal<TemplateResponse[] | null>(null);

  constructor() {
    this.load();
  }

  load() {
    this.svc.list().subscribe(list => this.templates.set(list));
  }

  useTemplate(template: TemplateResponse) {
    // Store template in session and navigate to create
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    this.router.navigateByUrl('/agents/wizard');
  }
}
