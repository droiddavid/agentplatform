import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filters
  selectedStatus = '';
  selectedPriority = '';
  selectedCategory = '';

  statusOptions = ['draft', 'ready', 'running', 'waiting_approval', 'completed', 'failed', 'cancelled'];
  priorityOptions = ['low', 'medium', 'high', 'urgent'];
  categoryOptions = ['work', 'personal', 'creative', 'research', 'household'];

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';

    let observable;
    if (this.selectedStatus) {
      observable = this.taskService.listTasksByStatus(this.selectedStatus, this.currentPage, this.pageSize);
    } else if (this.selectedPriority) {
      observable = this.taskService.listTasksByPriority(this.selectedPriority, this.currentPage, this.pageSize);
    } else if (this.selectedCategory) {
      observable = this.taskService.listTasksByCategory(this.selectedCategory, this.currentPage, this.pageSize);
    } else {
      observable = this.taskService.listTasks(this.currentPage, this.pageSize);
    }

    observable.subscribe({
      next: (response: any) => {
        this.tasks = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load tasks: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  viewTask(id: number) {
    this.router.navigate(['/tasks', id]);
  }

  editTask(id: number) {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete task: ' + (error.error?.message || error.message);
        }
      });
    }
  }

  archiveTask(id: number) {
    this.taskService.archiveTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to archive task: ' + (error.error?.message || error.message);
      }
    });
  }

  onStatusFilterChange() {
    this.currentPage = 0;
    this.loadTasks();
  }

  onPriorityFilterChange() {
    this.currentPage = 0;
    this.loadTasks();
  }

  onCategoryFilterChange() {
    this.currentPage = 0;
    this.loadTasks();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTasks();
    }
  }

  createNewTask() {
    this.router.navigate(['/tasks/create']);
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
