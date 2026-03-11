import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>Select Tools & Connections</h2>
        <p>What external services should this agent access?</p>
      </div>

      <div class="form-group">
        <p class="helper-text">Select all that apply</p>
        <div class="tools-list">
          <div 
            *ngFor="let tool of tools"
            class="tool-item"
            [class.checked]="isSelected(tool.value)">
            <input 
              type="checkbox"
              [id]="tool.value"
              [checked]="isSelected(tool.value)"
              (change)="toggleTool(tool.value)"
              class="checkbox">
            <label [for]="tool.value" class="checkbox-label">
              <span class="icon">{{ tool.icon }}</span>
              <span class="text">
                <strong>{{ tool.label }}</strong>
                <small>{{ tool.description }}</small>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-primary" (click)="proceed()" [disabled]="!canProceed()">
          Next: Collaboration
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wizard-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .step-header {
      margin-bottom: 2rem;
    }

    .step-header h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .step-header p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .helper-text {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .tools-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tool-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tool-item:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .tool-item.checked {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .checkbox {
      margin-top: 0.25rem;
      cursor: pointer;
      width: 20px;
      height: 20px;
    }

    .checkbox-label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: pointer;
      flex: 1;
    }

    .icon {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .text strong {
      color: #333;
      font-weight: 600;
    }

    .text small {
      color: #999;
      font-size: 0.85rem;
    }

    .step-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      flex: 1;
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
export class WizardStepToolsComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  tools = [
    { value: 'EMAIL', label: 'Email', icon: '📧', description: 'Read and send emails' },
    { value: 'CALENDAR', label: 'Calendar', icon: '📅', description: 'Check and create events' },
    { value: 'WEB_SEARCH', label: 'Web Search', icon: '🔍', description: 'Search the internet' },
    { value: 'WEB_BROWSE', label: 'Web Browsing', icon: '🌐', description: 'Browse websites' },
    { value: 'DOCUMENT', label: 'Documents', icon: '📄', description: 'Create and edit docs' },
    { value: 'STORAGE', label: 'File Storage', icon: '💾', description: 'Access cloud storage' }
  ];

  ngOnInit() {
    const d = this.wizardState.data();
    if (!d.allowedTools) {
      this.wizardState.updateData({ allowedTools: [] });
    }
  }

  isSelected(value: string): boolean {
    const tools = this.wizardState.data().allowedTools || [];
    return tools.includes(value);
  }

  toggleTool(value: string) {
    const current = this.wizardState.data().allowedTools || [];
    if (current.includes(value)) {
      this.wizardState.updateData({ allowedTools: current.filter(t => t !== value) });
    } else {
      this.wizardState.updateData({ allowedTools: [...current, value] });
    }
  }

  canProceed(): boolean {
    const tools = this.wizardState.data().allowedTools || [];
    return tools.length > 0;
  }

  proceed() {
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
