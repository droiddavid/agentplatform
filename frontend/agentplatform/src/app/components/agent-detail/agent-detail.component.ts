import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

interface AgentResponse {
  id: number;
  name: string;
  description: string;
}

interface TaskAssignment {
  id: number;
  taskId: number;
  agentId: number;
  assignedAt: string;
}

interface TaskInfo {
  id: number;
  title: string;
  status: string;
  priority: string;
}

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  template: `
    <app-page-header [title]="agent()?.name || 'Agent'" [subtitle]="agent()?.description || ''">
      <a routerLink="/agents" class="btn btn-secondary">Back to Agents</a>
    </app-page-header>

    @if (loading()) {
      <div class="container"><p>Loading agent...</p></div>
    }

    @if (agent()) {
      <div class="agent-detail-container">
        <!-- Agent Info -->
        <div class="card">
          <h2>{{ agent()!.name }}</h2>
          <p class="description">{{ agent()!.description || 'No description' }}</p>
          <div class="agent-meta">
            <span class="meta-item">ID: {{ agent()!.id }}</span>
          </div>
        </div>

        <!-- Assigned Tasks -->
        <div class="card">
          <h3>Assigned Tasks ({{ assignedTasks().length }})</h3>
          @if (assignedTasks().length === 0) {
            <p class="empty">No tasks assigned</p>
          } @else {
            <div class="tasks-list">
              @for (task of assignedTasks(); track task.id) {
                <div class="task-row">
                  <div class="task-info">
                    <strong>{{ task.title }}</strong>
                    <div class="badges">
                      <span class="badge status" [class]="'status-' + task.status">{{ task.status }}</span>
                      <span class="badge priority" [class]="'priority-' + task.priority">{{ task.priority }}</span>
                    </div>
                  </div>
                  <a [routerLink]="['/tasks', task.id]" class="btn btn-small btn-primary">View</a>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .agent-detail-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    h2, h3 { margin: 0 0 1rem 0; color: #333; }
    
    .description {
      color: #666;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }

    .agent-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .meta-item {
      background: #f5f5f5;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #666;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 4px;
      gap: 1rem;
    }

    .task-info strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .badges {
      display: flex;
      gap: 0.5rem;
    }

    .badge {
      display: inline-block;
      padding: 0.3rem 0.6rem;
      border-radius: 3px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-completed { background: #e8f5e9; color: #2e7d32; }
    .status-running { background: #e3f2fd; color: #1565c0; }
    .status-failed { background: #ffebee; color: #c62828; }
    .status-ready { background: #f3e5f5; color: #6a1b9a; }

    .priority-high { background: #ffebee; color: #c62828; }
    .priority-medium { background: #fff3e0; color: #e65100; }
    .priority-low { background: #e8f5e9; color: #2e7d32; }

    .empty { color: #999; padding: 1rem; text-align: center; }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover { background: #5568d3; }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover { background: #e0e0e0; }

    .btn-small { padding: 0.5rem 1rem; font-size: 0.85rem; }

    .container { max-width: 800px; margin: 2rem auto; padding: 0 1.5rem; }
  `]
})
export class AgentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  agent = signal<AgentResponse | null>(null);
  loading = signal(false);
  assignedTasks = signal<TaskInfo[]>([]);

  private agentId = 0;

  ngOnInit() {
    this.agentId = +(this.route.snapshot.paramMap.get('id') || 0);
    if (this.agentId) {
      this.load();
    }
  }

  private load() {
    this.loading.set(true);
    
    // Load agent info
    this.http.get<AgentResponse>(`/api/agents/${this.agentId}`).subscribe({
      next: (agent) => {
        this.agent.set(agent);
        this.loadTasks();
      },
      error: () => this.loading.set(false)
    });
  }

  private loadTasks() {
    // Get task IDs assigned to this agent
    this.http.get<TaskAssignment[]>(`/api/tasks/agent-assignments/agent/${this.agentId}/tasks`).subscribe({
      next: (assignments) => {
        // In a real app, fetch full task details
        // For now, just use the assignment data
        this.assignedTasks.set(
          assignments.map(a => ({
            id: a.taskId,
            title: `Task #${a.taskId}`,
            status: 'pending',
            priority: 'medium'
          }))
        );
      },
      error: () => this.assignedTasks.set([]),
      complete: () => this.loading.set(false)
    });
  }
}
