import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AgentService, ParseAgentResponse } from '../../services/agent.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';

@Component({
  selector: 'app-natural-language-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, LoadingStateComponent],
  template: `
    <app-page-header 
      title="Create Agent from Description" 
      subtitle="Describe what you want and we'll propose agents">
      <a routerLink="/agents" class="btn btn-secondary">Back to Agents</a>
    </app-page-header>

    <div class="builder-container">
      <div class="builder-section">
        <div class="input-panel">
          <h3>Describe Your Agent</h3>
          <textarea 
            [(ngModel)]="description"
            placeholder="Example: I need an agent that manages my emails, sends draft replies, and asks me before sending anything important. It should also search the web for context when needed."
            rows="8"
            class="description-textarea">
          </textarea>
          <button 
            (click)="parseDescription()"
            [disabled]="!description.trim() || loading()"
            class="btn btn-primary">
            {{ loading() ? 'Analyzing...' : 'Analyze Description' }}
          </button>
        </div>

        @if (error()) {
          <div class="error-banner">
            <div class="error-icon">⚠️</div>
            <div>{{ error() }}</div>
          </div>
        }

        @if (loading()) {
          <app-loading-state message="Analyzing your description..."></app-loading-state>
        }

        @if (parseResult() && !loading()) {
          <div class="results-panel">
            <h3>Proposed Agents</h3>
            @for (agent of parseResult()!.proposedAgents; track agent.name; let i = $index) {
              <div class="proposed-agent-card">
                <div class="agent-header">
                  <h4>{{ agent.name }}</h4>
                  <span class="agent-role">{{ agent.role }}</span>
                </div>

                <div class="agent-details">
                  <div class="detail-item">
                    <strong>Capabilities:</strong>
                    <div class="tags">
                      @for (cap of agent.capabilities; track cap) {
                        <span class="tag">{{ cap }}</span>
                      }
                    </div>
                  </div>

                  <div class="detail-item">
                    <strong>Tools:</strong>
                    <div class="tags">
                      @for (tool of agent.toolPermissions; track tool) {
                        <span class="tag tag-tool">{{ tool }}</span>
                      }
                    </div>
                  </div>

                  <div class="detail-item">
                    <strong>Approvals:</strong>
                    <p>{{ agent.approvalSummary }}</p>
                  </div>
                </div>

                <div class="agent-actions">
                  <button 
                    (click)="createFromProposal(agent)" 
                    [disabled]="creatingIndex() === i"
                    class="btn btn-primary">
                    {{ creatingIndex() === i ? 'Creating...' : 'Create This Agent' }}
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <div class="examples-panel">
        <h3>💡 Examples</h3>
        <div class="example-list">
          <button 
            (click)="fillExample(0)"
            class="example-btn">
            <strong>Email Assistant</strong>
            <small>Manage emails and draft replies</small>
          </button>
          <button 
            (click)="fillExample(1)"
            class="example-btn">
            <strong>Research Helper</strong>
            <small>Search and summarize information</small>
          </button>
          <button 
            (click)="fillExample(2)"
            class="example-btn">
            <strong>Task Manager</strong>
            <small>Organize and prioritize tasks</small>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .builder-container {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    @media (max-width: 1024px) {
      .builder-container {
        grid-template-columns: 1fr;
      }
    }

    .builder-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-panel,
    .results-panel,
    .examples-panel {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .description-textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 0.95rem;
      resize: vertical;
      margin-bottom: 1rem;
    }

    .description-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffebee;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 1rem;
      color: #c62828;
      font-size: 0.9rem;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .proposed-agent-card {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      transition: all 0.2s ease;
    }

    .proposed-agent-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .agent-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .agent-header h4 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    .agent-role {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .agent-details {
      margin-bottom: 1.5rem;
    }

    .detail-item {
      margin-bottom: 1rem;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-item strong {
      display: block;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .detail-item p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: #f0f4ff;
      color: #667eea;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .tag-tool {
      background: #fff3e0;
      color: #f57c00;
    }

    .agent-actions {
      display: flex;
      gap: 0.5rem;
    }

    .examples-panel {
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .example-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .example-btn {
      text-align: left;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .example-btn:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .example-btn strong {
      display: block;
      color: #333;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .example-btn small {
      display: block;
      color: #999;
      font-size: 0.8rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      width: 100%;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }
  `]
})
export class NaturalLanguageBuilderComponent {
  agentService = inject(AgentService);
  router = inject(Router);

  description = '';
  loading = signal(false);
  error = signal('');
  parseResult = signal<ParseAgentResponse | null>(null);
  creatingIndex = signal(-1);

  examples = [
    'I need an agent that manages my emails, sends draft replies to customers, and asks me before sending anything important. It should search the web for context when needed.',
    'Create an agent that researches topics, gathers information from multiple sources, summarizes findings, and organizes them into a structured report.',
    'I want an agent that helps me organize my tasks, prioritizes them based on deadlines, reminds me of important items, and helps break down big projects into smaller steps.'
  ];

  fillExample(index: number) {
    this.description = this.examples[index];
    this.parseDescription();
  }

  parseDescription() {
    if (!this.description.trim()) return;

    this.loading.set(true);
    this.error.set('');
    this.parseResult.set(null);

    this.agentService.parseDescription({ prompt: this.description }).subscribe({
      next: (result) => {
        this.parseResult.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error?.message || 'Failed to analyze description. Please try again.');
        this.loading.set(false);
      }
    });
  }

  async createFromProposal(agent: any) {
    const idx = this.parseResult()!.proposedAgents.indexOf(agent);
    if (idx >= 0) {
      this.creatingIndex.set(idx);
      try {
        await this.agentService.create({
          name: agent.name,
          description: agent.role
        }).toPromise();
        await this.router.navigate(['/agents']);
      } catch (err) {
        this.error.set('Failed to create agent');
      } finally {
        this.creatingIndex.set(-1);
      }
    }
  }
}
