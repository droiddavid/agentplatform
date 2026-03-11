import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent],
  template: `
    <app-page-header title="Dashboard" subtitle="Welcome to your AI agent platform">
      <a routerLink="/agents/wizard" class="btn btn-primary">Create New Agent</a>
    </app-page-header>

    <div class="dashboard-grid">
      <div class="card stat-card">
        <div class="stat-value">{{ activeAgents() }}</div>
        <div class="stat-label">Active Agents</div>
      </div>

      <div class="card stat-card">
        <div class="stat-value">{{ totalTasks() }}</div>
        <div class="stat-label">Tasks</div>
      </div>

      <div class="card stat-card">
        <div class="stat-value">{{ pendingApprovals() }}</div>
        <div class="stat-label">Pending Approvals</div>
      </div>

      <div class="card stat-card">
        <div class="stat-value">5 / 5</div>
        <div class="stat-label">Free Uses Remaining</div>
      </div>
    </div>

    <div class="dashboard-sections">
      <div class="card">
        <h3>Quick Start</h3>
        <p>New here? Create your first agent by choosing a template or describing what you need.</p>
        <div class="button-group">
          <a routerLink="/agents/wizard" class="btn btn-secondary">Create Agent</a>
          <a routerLink="/help" class="btn btn-secondary">View Help</a>
        </div>
      </div>

      <div class="card">
        <h3>Recent Activity</h3>
        <p *ngIf="!recentActivity()">No recent activity yet.</p>
        <div *ngIf="recentActivity()" class="activity-list">
          <div class="activity-item">Started first task</div>
          <div class="activity-item">Created first agent</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 0 1.5rem;
    }

    .stat-card {
      text-align: center;
      padding: 1.5rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .dashboard-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 0 1.5rem;
    }

    .card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .card h3 {
      margin: 0 0 0.75rem 0;
      color: #333;
    }

    .card p {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.95rem;
    }

    .button-group {
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
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .activity-item {
      padding: 0.75rem;
      background: #f9f9f9;
      border-left: 3px solid #667eea;
      border-radius: 4px;
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .dashboard-sections {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  private agentService = inject(AgentService);

  activeAgents = signal(0);
  totalTasks = signal(0);
  pendingApprovals = signal(0);
  recentActivity = signal(false);

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Load agents
    this.agentService.getAgents().subscribe({
      next: (agents) => this.activeAgents.set(agents.length),
      error: () => this.activeAgents.set(0)
    });
  }
}
