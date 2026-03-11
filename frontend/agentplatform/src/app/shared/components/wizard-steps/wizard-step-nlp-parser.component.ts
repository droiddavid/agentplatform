import { Component, inject, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WizardStateService } from '../../../services/wizard-state.service';

interface ProposedAgent {
  name: string;
  role: string;
  description: string;
  personaStyle?: string;
  goal: string;
  goalCategory?: string;
  capabilities: string[];
  allowedTools: string[];
  approvalPolicy?: string;
  workAlone?: boolean;
  enableMemory?: boolean;
  memoryType?: string;
  modelPreference?: string;
}

interface ParseResponse {
  summary: string;
  proposedAgents: ProposedAgent[];
  inferredTools?: string[];
  suggestedApprovalPolicy?: string;
  suggestedCollaborationStructure?: string;
  confidence?: number;
  notes?: string[];
}

@Component({
  selector: 'app-wizard-step-nlp-parser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Create Agent from Description</h2>
      <p class="subtitle">Describe what you want your agent to do in natural language</p>

      <div class="parser-container">
        <!-- Input Section -->
        <div class="input-section" *ngIf="!proposals || proposals.proposedAgents.length === 0">
          <label for="description">Your Agent Description:</label>
          <textarea
            id="description"
            [(ngModel)]="userDescription"
            placeholder="E.g., 'I need an agent that helps me manage my email, schedules meetings, and sends summaries of important emails to my boss daily.'"
            class="description-textarea"
            rows="5"
          ></textarea>

          <div class="input-actions">
            <button
              class="parse-btn"
              [disabled]="!userDescription.trim() || parsing"
              (click)="onParse()"
            >
              {{ parsing ? 'Parsing...' : 'Parse Description' }}
            </button>
            <span class="note" *ngIf="error">{{ error }}</span>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section" *ngIf="proposals && proposals.proposedAgents.length > 0">
          <div class="summary-box">
            <h3>Parsed Summary</h3>
            <p>{{ proposals.summary }}</p>
            <span class="confidence" *ngIf="proposals.confidence">
              Confidence: {{ proposals.confidence }}%
            </span>
          </div>

          <div class="notes-box" *ngIf="proposals.notes && proposals.notes.length > 0">
            <h4>Notes:</h4>
            <ul>
              <li *ngFor="let note of proposals.notes">{{ note }}</li>
            </ul>
          </div>

          <!-- Proposed Agents -->
          <div class="proposed-agents">
            <h3>Proposed Agents</h3>
            <div
              *ngFor="let agent of proposals.proposedAgents; let i = index"
              class="agent-card"
              [class.selected]="isAgentSelected(i)"
            >
              <div class="agent-header">
                <input 
                  type="checkbox" 
                  [checked]="isAgentSelected(i)"
                  (change)="toggleAgentSelection(i)"
                />
                <h4>{{ agent.name || 'Unnamed' }}</h4>
              </div>

              <div class="agent-fields">
                <div class="field">
                  <label>Name:</label>
                  <input type="text" [(ngModel)]="agent.name" />
                </div>
                <div class="field">
                  <label>Role:</label>
                  <input type="text" [(ngModel)]="agent.role" />
                </div>
                <div class="field">
                  <label>Description:</label>
                  <textarea [(ngModel)]="agent.description" rows="2"></textarea>
                </div>
                <div class="field">
                  <label>Goal:</label>
                  <input type="text" [(ngModel)]="agent.goal" />
                </div>
                <div class="field">
                  <label>Capabilities:</label>
                  <div class="tags-editor">
                    <span
                      *ngFor="let cap of agent.capabilities"
                      class="tag"
                      (click)="removeCapability(i, cap)"
                    >
                      {{ cap }} ×
                    </span>
                    <input
                      type="text"
                      placeholder="Add capability..."
                      (keydown.enter)="addCapability(i, $event)"
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Tools:</label>
                  <div class="tags-editor">
                    <span
                      *ngFor="let tool of agent.allowedTools"
                      class="tag"
                      (click)="removeTool(i, tool)"
                    >
                      {{ tool }} ×
                    </span>
                    <input
                      type="text"
                      placeholder="Add tool..."
                      (keydown.enter)="addTool(i, $event)"
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Model:</label>
                  <select [(ngModel)]="agent.modelPreference">
                    <option value="">Default</option>
                    <option value="fast">Fast</option>
                    <option value="balanced">Balanced</option>
                    <option value="accurate">Accurate</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Inferred Tools Section -->
          <div class="inferred-section" *ngIf="proposals.inferredTools && proposals.inferredTools.length > 0">
            <h4>Suggested Tools:</h4>
            <div class="tool-suggestions">
              <span *ngFor="let tool of proposals.inferredTools" class="tool-suggestion">
                {{ tool }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button class="secondary-btn" (click)="onStartOver()">Start Over</button>
            <button class="primary-btn" [disabled]="!hasSelectedAgents()" (click)="onSaveProposals()">
              Save Selected Agents ({{ getSelectedCount() }})
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step {
      animation: slideIn 0.3s ease;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .subtitle {
      margin: 0 0 1.5rem 0;
      color: #666;
      font-size: 0.95rem;
    }

    .parser-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-section {
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }

    .input-section label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #333;
    }

    .description-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 0.95rem;
      resize: vertical;
    }

    .description-textarea:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }

    .input-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-top: 1rem;
    }

    .parse-btn {
      padding: 0.75rem 1.5rem;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .parse-btn:hover:not(:disabled) {
      background: #0052a3;
    }

    .parse-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .note {
      color: #d32f2f;
      font-size: 0.9rem;
    }

    .results-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .summary-box {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-left: 4px solid #0066cc;
      border-radius: 4px;
      background: #f5f9ff;
    }

    .summary-box h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .summary-box p {
      margin: 0 0 0.5rem 0;
      color: #555;
    }

    .confidence {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #0066cc;
      color: white;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .notes-box {
      padding: 1rem;
      border: 1px solid #fff3cd;
      border-radius: 4px;
      background: #fffbf0;
    }

    .notes-box h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .notes-box ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #555;
    }

    .proposed-agents {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .proposed-agents h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .agent-card {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      transition: all 0.2s;
    }

    .agent-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .agent-card.selected {
      border-color: #0066cc;
      background: #f5f9ff;
    }

    .agent-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .agent-header input[type="checkbox"] {
      cursor: pointer;
    }

    .agent-header h4 {
      margin: 0;
      color: #333;
    }

    .agent-fields {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 0.75rem 0 0 2rem;
    }

    .field {
      display: flex;
      flex-direction: column;
    }

    .field label {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #333;
      font-size: 0.9rem;
    }

    .field input[type="text"],
    .field textarea,
    .field select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .field input[type="text"]:focus,
    .field textarea:focus,
    .field select:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }

    .tags-editor {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      align-items: center;
    }

    .tags-editor input {
      flex: 1;
      min-width: 100px;
      border: none;
      outline: none;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background: #e8eef7;
      border: 1px solid #b3c7e8;
      border-radius: 12px;
      color: #0066cc;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 500;
    }

    .tag:hover {
      background: #d1dff0;
    }

    .inferred-section {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fafafa;
    }

    .inferred-section h4 {
      margin: 0 0 0.75rem 0;
      color: #333;
    }

    .tool-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tool-suggestion {
      padding: 0.5rem 0.75rem;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      color: #856404;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .primary-btn,
    .secondary-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .primary-btn {
      background: #0066cc;
      color: white;
    }

    .primary-btn:hover:not(:disabled) {
      background: #0052a3;
    }

    .primary-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .secondary-btn {
      background: white;
      color: #0066cc;
      border: 1px solid #0066cc;
    }

    .secondary-btn:hover {
      background: #f5f9ff;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class WizardStepNlpParserComponent implements OnInit {
  private wizardState = inject(WizardStateService);
  private http = inject(HttpClient);

  userDescription = '';
  parsing = false;
  error = '';
  proposals: ParseResponse | null = null;
  selectedAgents = new Set<number>();

  parseCompleted = output<void>();

  private readonly baseUrl = 'http://localhost:8083';

  ngOnInit() {}

  onParse() {
    if (!this.userDescription.trim()) return;

    this.parsing = true;
    this.error = '';

    this.http.post<ParseResponse>(
      `${this.baseUrl}/api/agents/parse`,
      { description: this.userDescription }
    ).subscribe({
      next: (response) => {
        this.proposals = response;
        this.selectedAgents.clear();
        this.proposals.proposedAgents.forEach((_, index) => {
          this.selectedAgents.add(index);
        });
        this.parsing = false;
      },
      error: (err) => {
        this.error = 'Failed to parse description. Please try again.';
        this.parsing = false;
        console.error('Parse error:', err);
      }
    });
  }

  onStartOver() {
    this.userDescription = '';
    this.proposals = null;
    this.error = '';
    this.selectedAgents.clear();
  }

  isAgentSelected(index: number): boolean {
    return this.selectedAgents.has(index);
  }

  toggleAgentSelection(index: number) {
    if (this.selectedAgents.has(index)) {
      this.selectedAgents.delete(index);
    } else {
      this.selectedAgents.add(index);
    }
  }

  removeCapability(agentIndex: number, capability: string) {
    if (this.proposals) {
      const agent = this.proposals.proposedAgents[agentIndex];
      agent.capabilities = agent.capabilities.filter(c => c !== capability);
    }
  }

  removeTool(agentIndex: number, tool: string) {
    if (this.proposals) {
      const agent = this.proposals.proposedAgents[agentIndex];
      agent.allowedTools = agent.allowedTools.filter(t => t !== tool);
    }
  }

  addCapability(agentIndex: number, event: any) {
    const value = event.target?.value?.trim();
    if (value && this.proposals) {
      const agent = this.proposals.proposedAgents[agentIndex];
      if (!agent.capabilities.includes(value)) {
        agent.capabilities.push(value);
      }
      event.target.value = '';
    }
  }

  addTool(agentIndex: number, event: any) {
    const value = event.target?.value?.trim();
    if (value && this.proposals) {
      const agent = this.proposals.proposedAgents[agentIndex];
      if (!agent.allowedTools.includes(value)) {
        agent.allowedTools.push(value);
      }
      event.target.value = '';
    }
  }

  hasSelectedAgents(): boolean {
    return this.selectedAgents.size > 0;
  }

  getSelectedCount(): number {
    return this.selectedAgents.size;
  }

  onSaveProposals() {
    if (!this.proposals || this.selectedAgents.size === 0) return;

    const firstSelectedIndex = Array.from(this.selectedAgents)[0];
    const firstAgent = this.proposals.proposedAgents[firstSelectedIndex];

    this.wizardState.updateData({
      goal: firstAgent.goal,
      goalCategory: firstAgent.goalCategory as any,
      role: firstAgent.role,
      description: firstAgent.description,
      capabilities: firstAgent.capabilities,
      allowedTools: firstAgent.allowedTools,
      workAlone: firstAgent.workAlone !== false,
      approveEveryAction: firstAgent.approvalPolicy === 'every_action',
      rememberApprovals: firstAgent.approvalPolicy === 'remember',
      enableMemory: firstAgent.enableMemory !== false,
      memoryType: (firstAgent.memoryType as any) || 'short-term',
      modelPreference: (firstAgent.modelPreference as any) || 'balanced'
    });

    this.parseCompleted.emit();
  }
}
