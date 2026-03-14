import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-agent-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent],
  template: `
    <app-page-header title="Create Agent" subtitle="Start with a name and description">
      <a routerLink="/agents" class="btn btn-secondary">Cancel</a>
    </app-page-header>

    <div class="form-container">
      <form (ngSubmit)="submit()" class="create-form">
        @if (error()) {
          <div class="error-banner">
            <div class="error-icon">⚠️</div>
            <div>{{ error() }}</div>
          </div>
        }

        <div class="form-group">
          <label for="name">Agent Name</label>
          <input 
            id="name" 
            type="text" 
            name="name" 
            [(ngModel)]="name" 
            placeholder="e.g., Email Assistant, Research Bot"
            required 
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="description" 
            placeholder="What should this agent do? Be specific."
            rows="6"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="loading()" class="btn btn-primary">
            {{ loading() ? 'Creating...' : 'Create Agent' }}
          </button>
          <a routerLink="/agents" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .create-form {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffebee;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #c62828;
      font-size: 0.9rem;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
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
      flex: 1;
      text-align: center;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    @media (max-width: 768px) {
      .form-container {
        margin: 1rem auto;
      }

      .create-form {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        flex: unset;
      }
    }
  `]
})
export class AgentCreateComponent {
  private service = inject(AgentService);
  private router = inject(Router);

  name = '';
  description = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit() {
    this.loading.set(true);
    this.error.set(null);
    this.service.create({ name: this.name, description: this.description }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/agents');
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || err?.message || 'Failed to create agent');
      }
    });
  }
}
