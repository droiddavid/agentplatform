import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedContextEntryService, SharedContextEntry, SharedContextEntryRequest } from '../../services/shared-context-entry.service';

@Component({
  selector: 'app-shared-context-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shared-context-panel">
      <div class="context-header">
        <h2 class="context-title">Shared Context</h2>
        <div class="context-stats">
          Entries: <span class="stat-value">{{ entries.length }}</span>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Context Entries -->
      <div class="context-entries">
        <div *ngFor="let entry of entries" class="context-entry">
          <div class="entry-header">
            <div class="entry-key">{{ entry.contextKey }}</div>
            <span class="visibility-badge" [ngClass]="'visibility-' + entry.visibilityScope.toLowerCase()">
              {{ entry.visibilityScope }}
            </span>
          </div>

          <div class="entry-value">
            <pre>{{ formatJSON(parseJSON(entry.contextValueJson)) }}</pre>
          </div>

          <div class="entry-meta">
            <span class="entry-date">{{ formatDate(entry.updatedAt) }}</span>
            <button (click)="deleteEntry(entry.id)" class="btn-delete-small">Delete</button>
          </div>
        </div>

        <div *ngIf="entries.length === 0" class="no-entries">
          <p>No context entries yet</p>
        </div>
      </div>

      <!-- Add Context Form -->
      <div class="context-form-container">
        <div class="form-header">
          <h3>Add Context Entry</h3>
        </div>

        <div class="form-group">
          <label for="context-key">Context Key</label>
          <input 
            id="context-key"
            [(ngModel)]="newEntry.contextKey" 
            placeholder="e.g., meeting_summary, task_status"
            class="form-input">
        </div>

        <div class="form-group">
          <label for="context-value">Context Value (JSON)</label>
          <textarea 
            id="context-value"
            [(ngModel)]="newEntry.contextValueJson" 
            placeholder='{"key": "value"}'
            class="form-textarea"></textarea>
        </div>

        <div class="form-group">
          <label for="visibility">Visibility Scope</label>
          <select id="visibility" [(ngModel)]="newEntry.visibilityScope" class="form-select">
            <option value="SHARED">Shared</option>
            <option value="PRIVATE">Private</option>
            <option value="TEAM">Team</option>
          </select>
        </div>

        <button 
          (click)="addEntry()" 
          [disabled]="isSubmitting || !newEntry.contextKey"
          class="btn-submit">
          {{ isSubmitting ? 'Adding...' : 'Add Entry' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .shared-context-panel {
      padding: 24px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .context-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .context-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #111827;
    }

    .context-stats {
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

    .context-entries {
      margin-bottom: 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .context-entry {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .context-entry:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .entry-key {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      flex: 1;
      word-break: break-word;
    }

    .visibility-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .visibility-shared {
      background-color: #dbeafe;
      color: #0c4a6e;
    }

    .visibility-private {
      background-color: #fce7f3;
      color: #831843;
    }

    .visibility-team {
      background-color: #f3e8ff;
      color: #6b21a8;
    }

    .entry-value {
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 12px;
      max-height: 200px;
      overflow-y: auto;
    }

    .entry-value pre {
      margin: 0;
      font-size: 12px;
      color: #374151;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .entry-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
    }

    .entry-date {
      color: #6b7280;
    }

    .btn-delete-small {
      padding: 4px 8px;
      background-color: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-delete-small:hover {
      background-color: #dc2626;
    }

    .no-entries {
      text-align: center;
      padding: 30px 20px;
      color: #9ca3af;
      font-size: 14px;
    }

    .context-form-container {
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
      min-height: 100px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
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
export class SharedContextPanelComponent implements OnInit {
  @Input() runId!: number;

  entries: SharedContextEntry[] = [];
  newEntry: any = { visibilityScope: 'SHARED' };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private contextService: SharedContextEntryService) { }

  ngOnInit() {
    if (this.runId) {
      this.loadEntries();
    }
  }

  loadEntries() {
    this.contextService.getRunContextEntries(this.runId).subscribe({
      next: (entries: SharedContextEntry[]) => {
        this.entries = entries;
      },
      error: (error: any) => {
        console.error('Failed to load context entries:', error);
      }
    });
  }

  addEntry() {
    if (!this.newEntry.contextKey || !this.newEntry.contextKey.trim()) {
      this.errorMessage = 'Context key is required';
      return;
    }

    if (!this.newEntry.contextValueJson || !this.newEntry.contextValueJson.trim()) {
      this.errorMessage = 'Context value is required';
      return;
    }

    // Validate JSON
    try {
      JSON.parse(this.newEntry.contextValueJson);
    } catch (e) {
      this.errorMessage = 'Context value must be valid JSON';
      return;
    }

    this.isSubmitting = true;
    const request: SharedContextEntryRequest = {
      runId: this.runId.toString(),
      contextKey: this.newEntry.contextKey,
      contextValueJson: this.newEntry.contextValueJson,
      visibilityScope: this.newEntry.visibilityScope
    };

    this.contextService.createContextEntry(this.runId, request).subscribe({
      next: (entry: SharedContextEntry) => {
        this.entries.push(entry);
        this.newEntry = { visibilityScope: 'SHARED' };
        this.successMessage = 'Context entry added!';
        this.errorMessage = '';
        this.isSubmitting = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to add context entry: ' + (error.error?.message || error.message);
        this.isSubmitting = false;
      }
    });
  }

  deleteEntry(entryId: string) {
    if (confirm('Are you sure you want to delete this context entry?')) {
      this.contextService.deleteContextEntry(this.runId, entryId).subscribe({
        next: () => {
          this.entries = this.entries.filter(e => e.id !== entryId);
          this.successMessage = 'Context entry deleted!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete context entry: ' + (error.error?.message || error.message);
        }
      });
    }
  }

  parseJSON(json: string): any {
    try {
      return JSON.parse(json);
    } catch (e) {
      return json;
    }
  }

  formatJSON(obj: any): string {
    if (typeof obj === 'string') return obj;
    return JSON.stringify(obj, null, 2);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
