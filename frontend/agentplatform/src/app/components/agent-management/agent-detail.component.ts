import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgentService, AgentResponse } from '../../services/agent.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    <app-page-header title="Agent Details" subtitle="View agent information">
      <a routerLink="/agents" class="btn btn-secondary">Back to Agents</a>
    </app-page-header>

    @if (loading()) {
      <app-loading-state message="Loading agent details..."></app-loading-state>
    }

    @if (error()) {
      <app-error-state title="Error" message="{{ error() }}"></app-error-state>
    }

    @if (!loading() && agent()) {
      <div class="detail-container">
        <div class="detail-card">
          <h2>{{ agent()!.name }}</h2>
          <p class="description">{{ agent()!.description }}</p>
          
          <div class="detail-section">
            <h3>Information</h3>
            <div class="info-item">
              <label>Agent ID</label>
              <span>{{ agent()!.id }}</span>
            </div>
            <div class="info-item">
              <label>Owner ID</label>
              <span>{{ agent()!.ownerId }}</span>
            </div>
          </div>

          <div class="actions">
            <a [routerLink]="['/agents', agent()!.id, 'edit']" class="btn btn-primary">Edit Agent</a>
            <a routerLink="/agents" class="btn btn-secondary">Back</a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-container {
      max-width: 700px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .detail-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .detail-card h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .description {
      margin: 0 0 2rem 0;
      color: #666;
      font-size: 0.95rem;
    }

    .detail-section {
      margin: 2rem 0;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;
    }

    .detail-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .info-item label {
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .actions {
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

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }
  `]
})
export class AgentDetailComponent {
  route = inject(ActivatedRoute);
  agentService = inject(AgentService);

  agent = signal<AgentResponse | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.agentService.getAgent(Number(id)).subscribe({
        next: (agent) => {
          this.agent.set(agent);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load agent details');
          this.loading.set(false);
        }
      });
    } else {
      this.error.set('Agent ID not found');
      this.loading.set(false);
    }
  }
}
