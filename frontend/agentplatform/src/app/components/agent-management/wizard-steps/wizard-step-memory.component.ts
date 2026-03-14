import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-memory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>Memory Settings</h2>
        <p>How should the agent remember and use information?</p>
      </div>

      <div class="form-group">
        <label class="checkbox-item">
          <input 
            type="checkbox"
            [checked]="wizardState.data().enableMemory"
            (change)="wizardState.updateData({enableMemory: $any($event.target).checked})"
            class="checkbox">
          <span>
            <strong>Enable Memory</strong>
            <small>Agent learns from past conversations and decisions</small>
          </span>
        </label>
      </div>

      @if (wizardState.data().enableMemory) {
        <div class="form-group">
          <label>Memory Type</label>
          <div class="memory-options">
            <label class="radio-group">
              <input 
                type="radio"
                name="memoryType"
                value="short-term"
                [checked]="wizardState.data().memoryType === 'short-term'"
                (change)="wizardState.updateData({memoryType: 'short-term'})"
                class="radio">
              <span>
                <strong>Short-term</strong>
                <small>Remember only within a single conversation</small>
              </span>
            </label>
            <label class="radio-group">
              <input 
                type="radio"
                name="memoryType"
                value="long-term"
                [checked]="wizardState.data().memoryType === 'long-term'"
                (change)="wizardState.updateData({memoryType: 'long-term'})"
                class="radio">
              <span>
                <strong>Long-term</strong>
                <small>Remember across all conversations and tasks</small>
              </span>
            </label>
            <label class="radio-group">
              <input 
                type="radio"
                name="memoryType"
                value="both"
                [checked]="wizardState.data().memoryType === 'both'"
                (change)="wizardState.updateData({memoryType: 'both'})"
                class="radio">
              <span>
                <strong>Both</strong>
                <small>Short-term for context, long-term for patterns</small>
              </span>
            </label>
          </div>
        </div>
      }

      <div class="step-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-primary" (click)="proceed()">
          Next: Model Preference
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

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
      font-size: 0.95rem;
    }

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

    .checkbox-item:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .checkbox {
      margin-top: 0.25rem;
      cursor: pointer;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .memory-options {
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

    .radio-group span,
    .checkbox-item span {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: pointer;
      flex: 1;
    }

    .radio-group strong,
    .checkbox-item strong {
      color: #333;
      font-weight: 600;
    }

    .radio-group small,
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
export class WizardStepMemoryComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  ngOnInit() {
    if (this.wizardState.data().enableMemory === undefined) {
      this.wizardState.updateData({ enableMemory: true });
    }
    if (!this.wizardState.data().memoryType) {
      this.wizardState.updateData({ memoryType: 'long-term' });
    }
  }

  proceed() {
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
