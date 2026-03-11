import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-capabilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>Select Capabilities</h2>
        <p>What should this agent be able to do?</p>
      </div>

      <div class="form-group">
        <p class="helper-text">Select all that apply</p>
        <div class="capabilities-list">
          <div 
            *ngFor="let cap of capabilities"
            class="capability-item"
            [class.checked]="isSelected(cap.value)">
            <input 
              type="checkbox"
              [id]="cap.value"
              [checked]="isSelected(cap.value)"
              (change)="toggleCapability(cap.value)"
              class="checkbox">
            <label [for]="cap.value" class="checkbox-label">
              <span class="icon">{{ cap.icon }}</span>
              <span class="text">
                <strong>{{ cap.label }}</strong>
                <small>{{ cap.description }}</small>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-primary" (click)="proceed()" [disabled]="!canProceed()">
          Next: Tools
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

    .capabilities-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .capability-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .capability-item:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .capability-item.checked {
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
export class WizardStepCapabilitiesComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  capabilities = [
    { value: 'PLAN', label: 'Planning', icon: '📋', description: 'Create plans and strategies' },
    { value: 'DRAFT', label: 'Drafting', icon: '✍️', description: 'Write and compose content' },
    { value: 'COMMUNICATE', label: 'Communication', icon: '💬', description: 'Manage messages and replies' },
    { value: 'RESEARCH', label: 'Research', icon: '🔍', description: 'Search and gather information' },
    { value: 'ANALYZE', label: 'Analysis', icon: '📊', description: 'Analyze data and trends' },
    { value: 'CREATE', label: 'Creation', icon: '🎨', description: 'Generate creative content' }
  ];

  ngOnInit() {
    const d = this.wizardState.data();
    if (!d.capabilities) {
      this.wizardState.updateData({ capabilities: [] });
    }
  }

  isSelected(value: string): boolean {
    const caps = this.wizardState.data().capabilities || [];
    return caps.includes(value);
  }

  toggleCapability(value: string) {
    const current = this.wizardState.data().capabilities || [];
    if (current.includes(value)) {
      this.wizardState.updateData({ capabilities: current.filter(c => c !== value) });
    } else {
      this.wizardState.updateData({ capabilities: [...current, value] });
    }
  }

  canProceed(): boolean {
    const caps = this.wizardState.data().capabilities || [];
    return caps.length > 0;
  }

  proceed() {
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
