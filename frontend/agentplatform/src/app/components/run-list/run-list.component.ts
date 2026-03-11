import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RunService, Run } from '../../services/run.service';

@Component({
  selector: 'app-run-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './run-list.component.html',
  styleUrls: ['./run-list.component.css']
})
export class RunListComponent implements OnInit {
  runs: Run[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filters
  selectedStatus = '';
  selectedTaskId = '';
  selectedAgentId = '';

  statusOptions = ['pending', 'running', 'completed', 'failed', 'cancelled'];

  constructor(private runService: RunService, private router: Router) { }

  ngOnInit() {
    this.loadRuns();
  }

  loadRuns() {
    this.isLoading = true;
    this.errorMessage = '';

    let observable;
    if (this.selectedStatus) {
      observable = this.runService.listRunsByStatus(this.selectedStatus, this.currentPage, this.pageSize);
    } else if (this.selectedTaskId) {
      observable = this.runService.listRunsByTask(Number(this.selectedTaskId), this.currentPage, this.pageSize);
    } else if (this.selectedAgentId) {
      observable = this.runService.listRunsByAgent(Number(this.selectedAgentId), this.currentPage, this.pageSize);
    } else {
      observable = this.runService.listRuns(this.currentPage, this.pageSize);
    }

    observable.subscribe({
      next: (response: any) => {
        this.runs = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load runs: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  viewRun(id: number) {
    this.router.navigate(['/runs', id]);
  }

  startRun(id: number) {
    this.runService.startRun(id).subscribe({
      next: () => {
        this.loadRuns();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to start run: ' + (error.error?.message || error.message);
      }
    });
  }

  cancelRun(id: number) {
    if (confirm('Are you sure you want to cancel this run?')) {
      this.runService.cancelRun(id).subscribe({
        next: () => {
          this.loadRuns();
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to cancel run: ' + (error.error?.message || error.message);
        }
      });
    }
  }

  onStatusFilterChange() {
    this.currentPage = 0;
    this.loadRuns();
  }

  onTaskFilterChange() {
    this.currentPage = 0;
    this.loadRuns();
  }

  onAgentFilterChange() {
    this.currentPage = 0;
    this.loadRuns();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRuns();
    }
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  getDuration(startedAt: string | undefined, completedAt: string | undefined): string {
    if (!startedAt || !completedAt) return '-';
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }
}
