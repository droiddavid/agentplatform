import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TemplateService, TemplateResponse } from './services/template.service';
import { LoadingStateComponent } from './shared/components/loading-state.component';
import { ErrorStateComponent } from './shared/components/error-state.component';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingStateComponent, ErrorStateComponent],
  template: `
    @if (!template()) {
      <app-loading-state message="Loading template..."></app-loading-state>
    }

    @if (error()) {
      <app-error-state title="Template Not Found" message="The template you're looking for doesn't exist.">
      </app-error-state>
    }

    @if (template()) {
      <div class="detail-container">
        <div class="detail-header">
          <div class="back-button">
            <a routerLink="/templates" class="btn btn-secondary">← Back to Templates</a>
          </div>
          <div class="header-content">
            <div class="template-icon">{{ template()?.category?.icon || '⚙️' }}</div>
            <div class="header-text">
              <div class="category-badge">{{ template()?.category?.name || 'General' }}</div>
              <h1>{{ template()?.name }}</h1>
              <p class="subtitle">{{ template()?.description }}</p>
            </div>
          </div>
          <button class="btn btn-primary large" (click)="useTemplate()">Use This Template</button>
        </div>

        @if (template()?.content) {
          <div class="detail-section">
            <h2>Template Details</h2>
            <div class="content-preview">
              {{ template()?.content }}
            </div>
          </div>
        }

        <div class="detail-section">
          <h2>Template Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Category</span>
              <span class="value">{{ template()?.category?.name || 'General' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Created</span>
              <span class="value">{{ template()?.createdAt | date: 'short' }}</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary large" (click)="useTemplate()">Use This Template</button>
          <a routerLink="/templates" class="btn btn-secondary">View Other Templates</a>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .detail-header {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .back-button {
      margin-bottom: -1rem;
    }

    .back-button a {
      width: fit-content;
    }

    .header-content {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .template-icon {
      font-size: 3rem;
      flex-shrink: 0;
    }

    .header-text {
      flex-grow: 1;
    }

    .category-badge {
      display: inline-block;
      background: #f0f0f0;
      color: #666;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .header-text h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 2rem;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 1rem;
      line-height: 1.5;
    }

    .detail-section {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .detail-section h2 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
    }

    .content-preview {
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 1.5rem;
      font-family: monospace;
      font-size: 0.85rem;
      color: #555;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-item .label {
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .info-item .value {
      color: #333;
      font-size: 1rem;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
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
      display: inline-block;
    }

    .btn.large {
      padding: 1rem 2rem;
      font-size: 1rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      flex: 1;
    }

    .btn-primary:hover {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      flex: 1;
    }

    .btn-secondary:hover {
      background: #f0f0f0;
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-header {
        padding: 1.5rem;
      }

      .header-text h1 {
        font-size: 1.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn.large {
        width: 100%;
      }
    }
  `]
})
export class TemplateDetailComponent {
  private svc = inject(TemplateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  template = signal<TemplateResponse | null>(null);
  error = signal(false);

  constructor() {
    this.loadTemplate();
  }

  loadTemplate() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      return;
    }

    this.svc.get(Number(id)).subscribe({
      next: (template) => {
        this.template.set(template);
        this.error.set(false);
      },
      error: () => {
        this.error.set(true);
      }
    });
  }

  useTemplate() {
    if (this.template()) {
      sessionStorage.setItem('selectedTemplate', JSON.stringify(this.template()));
      this.router.navigateByUrl('/agents/wizard');
    }
  }
}
