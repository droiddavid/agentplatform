import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>AI Model Preference</h2>
        <p>Choose how you want the agent to think and respond</p>
      </div>

      <div class="form-group">
        <div class="model-options">
          <label class="radio-group">
            <input 
              type="radio"
              name="modelPreference"
              value="fast"
              [checked]="wizardState.data().modelPreference === 'fast'"
              (change)="wizardState.updateData({modelPreference: 'fast'})"
              class="radio">
            <span>
              <strong>⚡ Fast</strong>
              <small>Quick responses, good for simple tasks</small>
            </span>
          </label>
          <label class="radio-group">
            <input 
              type="radio"
              name="modelPreference"
              value="balanced"
              [checked]="wizardState.data().modelPreference === 'balanced'"
              (change)="wizardState.updateData({modelPreference: 'balanced'})"
              class="radio">
            <span>
              <strong>⚖️ Balanced</strong>
              <small>Good balance of speed and accuracy (recommended)</small>
            </span>
          </label>
          <label class="radio-group">
            <input 
              type="radio"
              name="modelPreference"
              value="accurate"
              [checked]="wizardState.data().modelPreference === 'accurate'"
              (change)="wizardState.updateData({modelPreference: 'accurate'})"
              class="radio">
            <span>
              <strong>🎯 Accurate</strong>
              <small>Best quality responses, slower but thorough</small>
            </span>
          </label>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-primary" (click)="proceed()" [disabled]="!canProceed()">
          Next: Review
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

    .model-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .radio-group {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .radio-group:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .radio {
      margin-top: 0.25rem;
      cursor: pointer;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .radio-group span {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: pointer;
      flex: 1;
    }

    .radio-group strong {
      color: #333;
      font-weight: 600;
    }

    .radio-group small {
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
export class WizardStepModelComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  ngOnInit() {
    if (!this.wizardState.data().modelPreference) {
      this.wizardState.updateData({ modelPreference: 'balanced' });
    }
  }

  canProceed(): boolean {
    return !!this.wizardState.data().modelPreference;
  }

  proceed() {
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
