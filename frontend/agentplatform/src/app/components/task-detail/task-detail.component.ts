import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ExecutionService } from '../../services/execution.service';
import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-detail-container">
      <div *ngIf="task(); else loading" class="task-content">
        <!-- Header -->
        <div class="task-header">
          <h1>{{ task()!.name }}</h1>
          <span class="status-badge" [ngClass]="'status-' + task()!.status">
            {{ task()!.status }}
          </span>
        </div>

        <!-- Task Info -->
        <div class="task-info">
          <p><strong>Description:</strong> {{ task()!.description || 'No description' }}</p>
          <p><strong>Created:</strong> {{ task()!.created_at | date:'short' }}</p>
          <p *ngIf="task()!.updated_at"><strong>Updated:</strong> {{ task()!.updated_at | date:'short' }}</p>
        </div>

        <!-- Execution Section -->
        <div class="execution-section">
          <h2>Execute Task</h2>

          <!-- Assigned Agents -->
          <div class="assigned-agents" *ngIf="(assignedAgents() || []).length > 0">
            <label>Select Agent to Execute:</label>
            <select (change)="onAgentSelect($event)" [value]="selectedAgent() || ''">
              <option value="">Choose an agent...</option>
              <option *ngFor="let agent of assignedAgents(); trackBy: trackAgentById" [value]="agent.id">
                {{ agent.name }}
              </option>
            </select>
          </div>

          <!-- Execute Buttons -->
          <div class="execution-actions">
            <button 
              *ngIf="assignedAgents() && (assignedAgents() || []).length > 0"
              (click)="executeWithSelected()"
              [disabled]="!selectedAgent() || isExecuting()"
              class="btn-primary">
              {{ isExecuting() ? 'Executing...' : 'Execute with Selected Agent' }}
            </button>
            <button 
              *ngIf="assignedAgents() && (assignedAgents() || []).length === 0"
              disabled
              class="btn-disabled">
              No agents assigned for execution
            </button>
          </div>

          <!-- Execution Status -->
          <div *ngIf="executionError()" class="alert-error">
            {{ executionError() }}
          </div>
          <div *ngIf="executionSuccess()" class="alert-success">
            Execution started successfully
          </div>
        </div>

        <!-- Execution History -->
        <div class="execution-history" *ngIf="executionHistory()">
          <h2>Execution History</h2>
          <div *ngIf="(executionHistory() || []).length > 0; else noHistory" class="history-list">
            <div *ngFor="let run of executionHistory(); trackBy: trackRunById" class="history-item">
              <div class="history-header">
                <span class="run-id">Run #{{ run.id }}</span>
                <span class="status-badge" [ngClass]="'status-' + run.status">{{ run.status }}</span>
                <span class="timestamp">{{ run.created_at | date:'short' }}</span>
              </div>
              <div *ngIf="run.agent" class="history-agent">
                <strong>Agent:</strong> {{ run.agent.name }}
              </div>
              <div *ngIf="run.output" class="history-output">
                <strong>Output:</strong> {{ run.output }}
              </div>
              <div *ngIf="run.error_message" class="history-error">
                <strong>Error:</strong> {{ run.error_message }}
              </div>
            </div>
          </div>
          <ng-template #noHistory>
            <p class="no-data">No execution history available</p>
          </ng-template>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading">Loading task details...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .task-detail-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 1rem;
    }

    .task-header h1 {
      margin: 0;
      font-size: 2rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-ready {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-running {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-completed {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .status-failed {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .task-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .task-info p {
      margin: 0.5rem 0;
    }

    .execution-section {
      background: #fafafa;
      padding: 1.5rem;
      border-radius: 4px;
      margin-bottom: 2rem;
      border-left: 4px solid #1976d2;
    }

    .execution-section h2 {
      margin-top: 0;
      color: #1976d2;
    }

    .assigned-agents {
      margin-bottom: 1.5rem;
    }

    .assigned-agents label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .assigned-agents select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }

    .execution-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .btn-primary, .btn-disabled {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-primary:disabled, .btn-disabled {
      background-color: #ccc;
      color: #666;
      cursor: not-allowed;
    }

    .alert-error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-success {
      background-color: #e8f5e9;
      color: #388e3c;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .execution-history {
      margin-top: 2rem;
    }

    .execution-history h2 {
      margin-top: 0;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .history-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .run-id {
      font-weight: 600;
    }

    .timestamp {
      font-size: 0.875rem;
      color: #666;
    }

    .history-agent, .history-output, .history-error {
      margin: 0.5rem 0;
      padding: 0.5rem 0 0.5rem 1rem;
      border-left: 3px solid #e0e0e0;
    }

    .history-agent {
      border-left-color: #1976d2;
      color: #1976d2;
    }

    .history-error {
      border-left-color: #d32f2f;
      color: #d32f2f;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  private taskId: number = 0;

  // State signals
  task = signal<any>(null);
  loading = signal(true);
  assignedAgents = signal<any[]>([]);
  executionHistory = signal<any[]>([]);
  selectedAgent = signal<string>('');
  isExecuting = signal(false);
  executionError = signal<string>('');
  executionSuccess = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private executionService: ExecutionService,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = parseInt(params['id'], 10);
      this.loadTask();
    });
  }

  private loadTask(): void {
    this.loading.set(true);
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loadAssignedAgents();
        this.loadExecutionHistory();
      },
      error: (err: any) => {
        console.error('Error loading task:', err);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  private loadAssignedAgents(): void {
    this.executionService.getTaskAgents(this.taskId).subscribe({
      next: (agents: any[]) => {
        this.assignedAgents.set(agents);
      },
      error: (err: any) => {
        console.error('Error loading agents:', err);
        this.assignedAgents.set([]);
      }
    });
  }

  private loadExecutionHistory(): void {
    this.executionService.getTaskExecutionHistory(this.taskId).subscribe({
      next: (runs: any[]) => {
        this.executionHistory.set(runs);
      },
      error: (err: any) => {
        console.error('Error loading history:', err);
        this.executionHistory.set([]);
      }
    });
  }

  executeWithSelected(): void {
    const agentId = this.selectedAgent();
    if (!agentId) return;

    this.isExecuting.set(true);
    this.executionError.set('');
    this.executionSuccess.set('');

    this.executionService.executeTaskWithAgent(this.taskId, agentId).subscribe({
      next: () => {
        this.executionSuccess.set('Execution started successfully');
        setTimeout(() => {
          this.executionSuccess.set('');
          this.loadExecutionHistory();
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error executing task:', err);
        this.executionError.set(err.error?.message || 'Failed to execute task');
      },
      complete: () => {
        this.isExecuting.set(false);
      }
    });
  }

  onAgentSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedAgent.set(target.value);
  }

  trackAgentById = (index: number, agent: any) => agent.id;
  trackRunById = (index: number, run: any) => run.id;
}
