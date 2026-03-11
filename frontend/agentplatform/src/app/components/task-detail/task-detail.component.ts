import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService, Task, TaskRequest } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;

  // Form data
  title = '';
  description = '';
  category = '';
  status = 'draft';
  priority = 'medium';
  dueAt = '';

  statusOptions = ['draft', 'ready', 'running', 'waiting_approval', 'completed', 'failed', 'cancelled'];
  priorityOptions = ['low', 'medium', 'high', 'urgent'];
  categoryOptions = ['work', 'personal', 'creative', 'research', 'household'];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.isEditMode = url.some(segment => segment.path === 'edit' || segment.path === 'create');
    });

    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId && this.isEditMode && taskId !== 'create') {
      this.loadTask(Number(taskId));
    } else if (taskId && !this.isEditMode) {
      this.loadTask(Number(taskId));
      this.isEditMode = false;
    } else {
      // New task creation
      this.isEditMode = true;
    }
  }

  loadTask(id: number) {
    this.isLoading = true;
    this.taskService.getTask(id).subscribe({
      next: (task: Task) => {
        this.task = task;
        this.populateFormFromTask(task);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load task: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  populateFormFromTask(task: Task) {
    this.title = task.title;
    this.description = task.description || '';
    this.category = task.category;
    this.status = task.status;
    this.priority = task.priority;
    this.dueAt = task.dueAt ? new Date(task.dueAt).toISOString().split('T')[0] : '';
  }

  save() {
    if (!this.title.trim() || !this.category) {
      this.errorMessage = 'Title and category are required';
      return;
    }

    this.isSaving = true;
    const request: TaskRequest = {
      title: this.title,
      description: this.description,
      category: this.category,
      status: this.status,
      priority: this.priority,
      dueAt: this.dueAt ? new Date(this.dueAt).toISOString() : undefined
    };

    let observable;
    if (this.task?.id) {
      observable = this.taskService.updateTask(this.task.id, request);
    } else {
      observable = this.taskService.createTask(request);
    }

    observable.subscribe({
      next: (result: Task) => {
        this.successMessage = `Task ${this.task?.id ? 'updated' : 'created'} successfully`;
        this.task = result;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/tasks']);
        }, 1500);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to save task: ' + (error.error?.message || error.message);
        this.isSaving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }

  delete() {
    if (this.task?.id && confirm('Are you sure you want to delete this task?')) {
      this.isSaving = true;
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.successMessage = 'Task deleted successfully';
          this.isSaving = false;
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1500);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete task: ' + (error.error?.message || error.message);
          this.isSaving = false;
        }
      });
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode && this.task) {
      this.populateFormFromTask(this.task);
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'waiting_approval': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
