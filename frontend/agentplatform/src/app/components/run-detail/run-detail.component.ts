import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RunService, Run } from '../../services/run.service';

@Component({
  selector: 'app-run-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="container mx-auto py-8 max-w-4xl">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Run Details</h1>
    <button
      (click)="goBack()"
      class="text-gray-600 hover:text-gray-900">
      ✕
    </button>
  </div>

  @if (errorMessage) {
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>
  }

  @if (isLoading) {
    <div class="text-center py-8">
      <div class="inline-block animate-spin">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </div>
    </div>
  }

  @if (!isLoading && run) {
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="border-b border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl font-bold">Run #{{ run.id }}</h2>
              <span [ngClass]="getStatusColor(run.status)" class="px-3 py-1 rounded-full text-sm font-semibold">
                {{ run.status }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mt-1">Created {{ formatDate(run.createdAt) }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-600">Task #{{ run.taskId }} • Agent #{{ run.agentId }}</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          @if (run.status === 'pending') {
            <button
              (click)="startRun()"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Start Run
            </button>
          }
          @if (run.status === 'running') {
            <button
              (click)="cancelRun()"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cancel Run
            </button>
          }
          <button
            (click)="goBack()"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Back
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 bg-gray-50">
        <div>
          <div class="text-sm text-gray-600 mb-1">Started</div>
          <div class="font-semibold">{{ formatDate(run.startedAt) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 mb-1">Completed</div>
          <div class="font-semibold">{{ formatDate(run.completedAt) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 mb-1">Duration</div>
          <div class="font-semibold">{{ getDuration() }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 mb-1">Last Updated</div>
          <div class="font-semibold text-xs">{{ formatDate(run.updatedAt) }}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="flex">
          <button
            (click)="selectTab('overview')"
            [class.bg-blue-50]="activeTab === 'overview'"
            [class.border-blue-500]="activeTab === 'overview'"
            class="px-6 py-3 border-b-2 border-transparent text-sm font-medium">
            Overview
          </button>
          <button
            (click)="selectTab('input')"
            [class.bg-blue-50]="activeTab === 'input'"
            [class.border-blue-500]="activeTab === 'input'"
            class="px-6 py-3 border-b-2 border-transparent text-sm font-medium">
            Input
          </button>
          @if (run.output) {
            <button
              (click)="selectTab('output')"
              [class.bg-blue-50]="activeTab === 'output'"
              [class.border-blue-500]="activeTab === 'output'"
              class="px-6 py-3 border-b-2 border-transparent text-sm font-medium">
              Output
            </button>
          }
          @if (run.logs) {
            <button
              (click)="selectTab('logs')"
              [class.bg-blue-50]="activeTab === 'logs'"
              [class.border-blue-500]="activeTab === 'logs'"
              class="px-6 py-3 border-b-2 border-transparent text-sm font-medium">
              Logs
            </button>
          }
          @if (run.errorMessage) {
            <button
              (click)="selectTab('error')"
              [class.bg-blue-50]="activeTab === 'error'"
              [class.border-blue-500]="activeTab === 'error'"
              class="px-6 py-3 border-b-2 border-transparent text-sm font-medium">
              Error
            </button>
          }
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        @if (activeTab === 'overview') {
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Run ID</label>
              <div class="text-gray-900 font-mono">{{ run.id }}</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
                <div class="text-gray-900 font-mono">#{{ run.taskId }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
                <div class="text-gray-900 font-mono">#{{ run.agentId }}</div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span [ngClass]="getStatusColor(run.status)" class="px-3 py-1 rounded-full text-sm font-semibold inline-block">
                {{ run.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <div class="text-gray-900">{{ formatDate(run.createdAt) }}</div>
            </div>
            @if (run.startedAt) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Started At</label>
                <div class="text-gray-900">{{ formatDate(run.startedAt) }}</div>
              </div>
            }
            @if (run.completedAt) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Completed At</label>
                <div class="text-gray-900">{{ formatDate(run.completedAt) }}</div>
              </div>
            }
          </div>
        }

        <!-- Input Tab -->
        @if (activeTab === 'input') {
          <pre class="bg-gray-100 p-4 rounded overflow-auto text-sm"><code>{{ formatJson(tryParseJson(run.input)) }}</code></pre>
        }

        <!-- Output Tab -->
        @if (activeTab === 'output' && run.output) {
          <pre class="bg-gray-100 p-4 rounded overflow-auto text-sm"><code>{{ formatJson(tryParseJson(run.output)) }}</code></pre>
        }

        <!-- Logs Tab -->
        @if (activeTab === 'logs' && run.logs) {
          <pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-xs"><code>{{ run.logs }}</code></pre>
        }

        <!-- Error Tab -->
        @if (activeTab === 'error' && run.errorMessage) {
          <div class="bg-red-50 border border-red-200 rounded p-4">
            <h3 class="text-red-800 font-semibold mb-2">Error Details</h3>
            <pre class="text-red-700 text-xs overflow-auto"><code>{{ run.errorMessage }}</code></pre>
          </div>
        }
      </div>
    </div>
  }
</div>`,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 56rem;
      margin: 0 auto;
    }

    pre {
      max-height: 400px;
      overflow-y: auto;
    }

    code {
      font-family: 'Courier New', monospace;
    }

    button[class*="border-blue"] {
      border-bottom-color: rgb(59, 130, 246);
    }
  `]
})
export class RunDetailComponent implements OnInit {
  run: Run | null = null;
  isLoading = false;
  errorMessage = '';
  activeTab = 'overview'; // overview, output, logs, error

  constructor(
    private runService: RunService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const runId = this.route.snapshot.paramMap.get('id');
    if (runId) {
      this.loadRun(Number(runId));
    }
  }

  loadRun(id: number) {
    this.isLoading = true;
    this.runService.getRun(id).subscribe({
      next: (run: Run) => {
        this.run = run;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load run: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  startRun() {
    if (this.run) {
      this.runService.startRun(this.run.id).subscribe({
        next: (updatedRun: Run) => {
          this.run = updatedRun;
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to start run: ' + (error.error?.message || error.message);
        }
      });
    }
  }

  cancelRun() {
    if (this.run && confirm('Are you sure you want to cancel this run?')) {
      this.runService.cancelRun(this.run.id).subscribe({
        next: () => {
          if (this.run) {
            this.run.status = 'cancelled';
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to cancel run: ' + (error.error?.message || error.message);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/runs']);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  getDuration(): string {
    if (!this.run || !this.run.startedAt || !this.run.completedAt) return '-';
    const start = new Date(this.run.startedAt).getTime();
    const end = new Date(this.run.completedAt).getTime();
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }

  tryParseJson(str: string | undefined): any {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  formatJson(obj: any): string {
    if (typeof obj === 'string') return obj;
    return JSON.stringify(obj, null, 2);
  }
}
