import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AgentService, AgentResponse } from '../../services/agent.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, EmptyStateComponent, LoadingStateComponent],
  template: `
    <app-page-header title="Agents" subtitle="Manage your AI agents">
      <a routerLink="/agents/wizard" class="btn btn-primary">Create Agent</a>
    </app-page-header>

    @if (loading()) {
      <app-loading-state message="Loading agents..."></app-loading-state>
    }

    @if (!loading() && error()) {
      <div class="error-container">
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <div>
            <strong>Failed to Load Agents</strong>
            <p>{{ error() }}</p>
            <button class="btn btn-secondary" (click)="load()">Retry</button>
          </div>
        </div>
      </div>
    }

    @if (!loading() && !error() && agents().length === 0) {
      <app-empty-state icon="🤖" title="No agents yet" message="Create your first agent to get started.">
        <a routerLink="/agents/wizard" class="btn btn-primary">Create Agent</a>
      </app-empty-state>
    }

    @if (!loading() && !error() && agents().length > 0) {
      <div class="agents-container">
        @for (agent of agents(); track agent.id) {
          <div class="agent-card">
            <div class="agent-header">
              <h3>{{ agent.name }}</h3>
              <a [routerLink]="['/agents', agent.id, 'edit']" class="btn btn-secondary">Edit</a>
            </div>
            <p class="agent-description">{{ agent.description }}</p>
            <div class="agent-meta">
              <span class="badge">Created by you</span>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .error-container {
      padding: 1.5rem;
    }

    .error-message {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: #ffebee;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      padding: 1.5rem;
      color: #c62828;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .error-message strong {
      display: block;
      margin-bottom: 0.5rem;
    }

    .error-message p {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
    }

    .agents-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .agent-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .agent-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #667eea;
    }

    .agent-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .agent-header h3 {
      margin: 0;
      color: #333;
      flex: 1;
    }

    .agent-description {
      color: #666;
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .agent-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #f0f0f0;
      color: #666;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    @media (max-width: 768px) {
      .agents-container {
        grid-template-columns: 1fr;
      }

      .agent-header {
        flex-direction: column;
      }

      .agent-header a {
        width: 100%;
      }
    }
  `]
})
export class AgentListComponent {
  private service = inject(AgentService);
  private router = inject(Router);

  agents = signal<AgentResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAgents().subscribe({
      next: data => {
        this.agents.set(data || []);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.message || 'Failed to load agents');
        this.loading.set(false);
      }
    });
  }

  openCreate() {
    this.router.navigateByUrl('/agents/wizard');
  }
}
