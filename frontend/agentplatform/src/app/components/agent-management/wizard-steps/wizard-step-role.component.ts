import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>Define the Agent's Role</h2>
        <p>What title or role should this agent have?</p>
      </div>

      <div class="form-group">
        <label for="role">Role Title</label>
        <input 
          id="role"
          type="text"
          [(ngModel)]="role"
          placeholder="e.g., Email Assistant, Task Manager, Research Helper"
          class="form-input">
      </div>

      <div class="form-group">
        <label for="description">Description of Role</label>
        <textarea 
          id="description"
          [(ngModel)]="description"
          placeholder="Describe what this agent does and how it helps you"
          rows="5"
          class="form-textarea">
        </textarea>
      </div>

      <div class="step-actions">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-primary" (click)="proceed()" [disabled]="!canProceed()">
          Next: Capabilities
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

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.95rem;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
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
export class WizardStepRoleComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  role = '';
  description = '';

  ngOnInit() {
    const d = this.wizardState.data();
    this.role = d.role || '';
    this.description = d.description || '';
  }

  canProceed(): boolean {
    return !!this.role.trim() && !!this.description.trim();
  }

  proceed() {
    this.wizardState.updateData({ role: this.role, description: this.description });
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
