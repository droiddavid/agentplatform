import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RunService, Run, RunEvent } from '../../services/run.service';
import { MessageThreadComponent } from '../message-thread/message-thread.component';
import { MessageService } from '../../services/message.service';
import { SharedTaskBoardComponent } from '../shared-task-board/shared-task-board.component';
import { SharedContextPanelComponent } from '../shared-context-panel/shared-context-panel.component';
import { TaskBoardItemService } from '../../services/task-board-item.service';
import { SharedContextEntryService } from '../../services/shared-context-entry.service';

@Component({
  selector: 'app-run-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageThreadComponent, SharedTaskBoardComponent, SharedContextPanelComponent],
  templateUrl: './run-detail.component.html',
  styleUrls: ['./run-detail.component.css']
})
export class RunDetailComponent implements OnInit {
  run: Run | null = null;
  events: RunEvent[] = [];
  messageCount = 0;
  boardItemCount = 0;
  contextEntryCount = 0;
  isLoading = false;
  errorMessage = '';
  activeTab = 'overview'; // overview, output, logs, error, events, messages, board, context

  constructor(
    private runService: RunService,
    private messageService: MessageService,
    private taskBoardItemService: TaskBoardItemService,
    private contextEntryService: SharedContextEntryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const runId = this.route.snapshot.paramMap.get('id');
    if (runId) {
      this.loadRun(Number(runId));
      this.loadEvents(Number(runId));
      this.loadMessageCount(Number(runId));
      this.loadBoardItemCount(Number(runId));
      this.loadContextEntryCount(Number(runId));
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

  loadEvents(runId: number) {
    this.runService.getRunEvents(runId).subscribe({
      next: (events: RunEvent[]) => {
        this.events = events;
      },
      error: (error: any) => {
        console.error('Failed to load events:', error);
      }
    });
  }

  loadMessageCount(runId: number) {
    this.messageService.getMessageCount(runId).subscribe({
      next: (count: number) => {
        this.messageCount = count;
      },
      error: (error: any) => {
        console.error('Failed to load message count:', error);
      }
    });
  }

  loadBoardItemCount(runId: number) {
    this.taskBoardItemService.getTaskBoardItemCount(runId).subscribe({
      next: (count: number) => {
        this.boardItemCount = count;
      },
      error: (error: any) => {
        console.error('Failed to load board item count:', error);
      }
    });
  }

  loadContextEntryCount(runId: number) {
    this.contextEntryService.getContextEntryCount(runId).subscribe({
      next: (count: number) => {
        this.contextEntryCount = count;
      },
      error: (error: any) => {
        console.error('Failed to load context entry count:', error);
      }
    });
  }

  startRun() {
    if (this.run) {
      this.runService.startRun(this.run.id).subscribe({
        next: (updatedRun: Run) => {
          this.run = updatedRun;
          // Refresh events after starting run
          this.loadEvents(updatedRun.id);
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
            // Refresh events after cancelling run
            this.loadEvents(this.run.id);
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
    // Auto-refresh events when events tab is selected
    if (tab === 'events' && this.run) {
      this.loadEvents(this.run.id);
    }
    // Auto-refresh message count when messages tab is selected
    if (tab === 'messages' && this.run) {
      this.loadMessageCount(this.run.id);
    }
    // Auto-refresh board count when board tab is selected
    if (tab === 'board' && this.run) {
      this.loadBoardItemCount(this.run.id);
    }
    // Auto-refresh context count when context tab is selected
    if (tab === 'context' && this.run) {
      this.loadContextEntryCount(this.run.id);
    }
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
