import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>Approval Settings</h2>
        <p>Control how the agent should handle internal and external actions</p>
      </div>

      <div class="form-group">
        <label class="radio-group">
          <input 
            type="radio"
            name="approveEveryAction"
            [checked]="wizardState.data().approveEveryAction === true"
            (change)="wizardState.updateData({approveEveryAction: true})"
            class="radio">
          <span class="radio-label">
            <strong>Ask me for every action</strong>
            <small>I want to review and approve everything before the agent acts</small>
          </span>
        </label>
      </div>

      <div class="form-group">
        <label class="radio-group">
          <input 
            type="radio"
            name="approveEveryAction"
            [checked]="wizardState.data().approveEveryAction === false"
            (change)="wizardState.updateData({approveEveryAction: false})"
            class="radio">
          <span class="radio-label">
            <strong>Proceed with confidence</strong>
            <small>The agent can act on its own (with some safety limits)</small>
          </span>
        </label>
      </div>

      <div class="form-group">
        <label class="checkbox-item">
          <input 
            type="checkbox"
            [checked]="wizardState.data().rememberApprovals"
            (change)="wizardState.updateData({rememberApprovals: $any($event.target).checked})"
            class="checkbox">
          <span>Remember my decisions</span>
          <small>Save approval patterns to avoid repeated prompts</small>
        </label>
      </div>

      <div class="step-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-primary" (click)="proceed()">
          Next: Memory Settings
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
      margin-bottom: 1.5rem;
    }

    .radio-group,
    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .radio-group:hover,
    .checkbox-item:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .radio,
    .checkbox {
      margin-top: 0.25rem;
      cursor: pointer;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .radio-label,
    .radio-label small,
    .checkbox-item small {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: pointer;
      flex: 1;
    }

    .radio-label strong,
    .checkbox-item strong {
      color: #333;
      font-weight: 600;
    }

    .radio-label small,
    .checkbox-item small {
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

    .btn-primary:hover {
      background: #5568d3;
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
export class WizardStepApprovalsComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  proceed() {
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
