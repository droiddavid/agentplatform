import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskBoardItemService, TaskBoardItem, TaskBoardItemRequest } from '../../services/task-board-item.service';

@Component({
  selector: 'app-shared-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shared-task-board-container">
      <div class="board-header">
        <h2 class="board-title">Shared Task Board</h2>
        <div class="board-stats">
          Total Tasks: <span class="stat-value">{{ items.length }}</span>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Task Board Grid -->
      <div class="task-board-grid">
        <div *ngFor="let item of items" 
             [class.task-card]="true"
             [class.priority-high]="item.priority === 'HIGH'"
             [class.priority-medium]="item.priority === 'MEDIUM'"
             [class.priority-low]="item.priority === 'LOW'"
             [class.status-completed]="item.status === 'completed'">
          
          <div class="task-header">
            <div class="task-title">{{ item.title }}</div>
            <div class="task-meta">
              <span class="priority-badge" [ngClass]="'priority-' + item.priority.toLowerCase()">
                {{ item.priority }}
              </span>
              <span class="status-badge" [ngClass]="'status-' + item.status">
                {{ item.status }}
              </span>
            </div>
          </div>

          <div *ngIf="item.description" class="task-description">
            {{ item.description }}
          </div>

          <div class="task-footer">
            <div class="task-info">
              <span class="task-date">Created: {{ formatDate(item.createdAt) }}</span>
              <span *ngIf="item.assignedToRunAgentId" class="task-assigned">
                Assigned to Agent #{{ item.assignedToRunAgentId }}
              </span>
            </div>
            <div class="task-actions">
              <button *ngIf="item.status !== 'completed'" 
                      (click)="completeTask(item.id)"
                      class="btn-complete">
                Complete
              </button>
              <button (click)="deleteTask(item.id)" class="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="items.length === 0" class="no-tasks">
          <p>No tasks on the board yet</p>
        </div>
      </div>

      <!-- Add Task Form -->
      <div class="task-form-container">
        <div class="form-header">
          <h3>Add New Task</h3>
        </div>

        <div class="form-group">
          <label for="title">Task Title</label>
          <input 
            id="title"
            [(ngModel)]="newTask.title" 
            placeholder="Enter task title"
            class="form-input">
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            [(ngModel)]="newTask.description" 
            placeholder="Enter task description"
            class="form-textarea"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" [(ngModel)]="newTask.status" class="form-select">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" [(ngModel)]="newTask.priority" class="form-select">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <button 
          (click)="addTask()" 
          [disabled]="isSubmitting || !newTask.title"
          class="btn-submit">
          {{ isSubmitting ? 'Adding...' : 'Add Task' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .shared-task-board-container {
      padding: 24px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .board-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #111827;
    }

    .board-stats {
      font-size: 14px;
      color: #6b7280;
    }

    .stat-value {
      font-weight: 600;
      color: #2563eb;
    }

    .error-message {
      background-color: #fee2e2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .success-message {
      background-color: #dcfce7;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .task-board-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .task-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s ease;
      border-left: 4px solid #9ca3af;
    }

    .task-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .task-card.priority-high {
      border-left-color: #dc2626;
    }

    .task-card.priority-medium {
      border-left-color: #f59e0b;
    }

    .task-card.priority-low {
      border-left-color: #10b981;
    }

    .task-card.status-completed {
      opacity: 0.6;
      background-color: #f3f4f6;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .task-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      flex: 1;
      word-wrap: break-word;
    }

    .task-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .priority-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .priority-high {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .priority-medium {
      background-color: #fef3c7;
      color: #92400e;
    }

    .priority-low {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      background-color: #e0e7ff;
      color: #3730a3;
      white-space: nowrap;
    }

    .status-completed {
      background-color: #dbeafe;
    }

    .task-description {
      font-size: 14px;
      color: #4b5563;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: #6b7280;
    }

    .task-date,
    .task-assigned {
      font-size: 12px;
    }

    .task-actions {
      display: flex;
      gap: 8px;
    }

    .btn-complete,
    .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-complete {
      background-color: #10b981;
      color: white;
    }

    .btn-complete:hover {
      background-color: #059669;
    }

    .btn-delete {
      background-color: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background-color: #dc2626;
    }

    .no-tasks {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
      font-size: 16px;
    }

    .task-form-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
    }

    .form-header {
      margin-bottom: 20px;
    }

    .form-header h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #111827;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .btn-submit {
      width: 100%;
      padding: 10px;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .btn-submit:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  `]
})
export class SharedTaskBoardComponent implements OnInit {
  @Input() runId!: number;

  items: TaskBoardItem[] = [];
  newTask: any = { status: 'pending', priority: 'MEDIUM' };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private taskBoardItemService: TaskBoardItemService) { }

  ngOnInit() {
    if (this.runId) {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.taskBoardItemService.getRunTaskBoardItems(this.runId).subscribe({
      next: (tasks: TaskBoardItem[]) => {
        this.items = tasks;
      },
      error: (error: any) => {
        console.error('Failed to load tasks:', error);
      }
    });
  }

  addTask() {
    if (!this.newTask.title || !this.newTask.title.trim()) {
      this.errorMessage = 'Task title is required';
      return;
    }

    this.isSubmitting = true;
    const request: TaskBoardItemRequest = {
      runId: this.runId.toString(),
      title: this.newTask.title,
      description: this.newTask.description,
      status: this.newTask.status,
      priority: this.newTask.priority
    };

    this.taskBoardItemService.sendTaskBoardItem(this.runId, request).subscribe({
      next: (item: TaskBoardItem) => {
        this.items.push(item);
        this.newTask = { status: 'pending', priority: 'MEDIUM' };
        this.successMessage = 'Task added!';
        this.errorMessage = '';
        this.isSubmitting = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to add task: ' + (error.error?.message || error.message);
        this.isSubmitting = false;
      }
    });
  }

  completeTask(itemId: string) {
    this.taskBoardItemService.markAsCompleted(this.runId, itemId).subscribe({
      next: (item: TaskBoardItem) => {
        const index = this.items.findIndex(t => t.id === itemId);
        if (index !== -1) {
          this.items[index] = item;
        }
        this.successMessage = 'Task completed!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to complete task: ' + (error.error?.message || error.message);
      }
    });
  }

  deleteTask(itemId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskBoardItemService.deleteTaskBoardItem(this.runId, itemId).subscribe({
        next: () => {
          this.items = this.items.filter(t => t.id !== itemId);
          this.successMessage = 'Task deleted!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete task: ' + (error.error?.message || error.message);
        }
      });
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
