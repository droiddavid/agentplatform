import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Describe the Agent's Role</h2>
      <p class="subtitle">What role will this agent play?</p>

      <div class="form-group">
        <label for="role">Agent Role</label>
        <input 
          id="role" 
          type="text" 
          [(ngModel)]="role" 
          (change)="updateRole()"
          placeholder="e.g., Email Manager, Research Assistant, Meeting Scheduler"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="description">Detailed Description</label>
        <textarea 
          id="description" 
          [(ngModel)]="description" 
          (change)="updateDescription()"
          placeholder="Describe what this agent should do in detail..."
          rows="4"
          class="form-input"
        ></textarea>
      </div>

      <div class="validation-status" *ngIf="!isValid()">
        <span class="status-icon">⚠️</span>
        <span>Please fill in all fields to continue</span>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500; font-size: 0.9rem; }
    .form-input {
      width: 100%; padding: 0.75rem; border: 1px solid #d0d0d0; border-radius: 6px;
      font-family: inherit; font-size: 0.95rem; transition: all 0.2s ease;
    }
    .form-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .validation-status {
      display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
      background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; color: #856404; font-size: 0.9rem;
    }
    .status-icon { font-size: 1.1rem; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepRoleComponent implements OnInit {
  wizard = inject(WizardStateService);
  role = '';
  description = '';

  ngOnInit() {
    const data = this.wizard.data();
    this.role = data.role || '';
    this.description = data.description || '';
  }

  updateRole() {
    this.wizard.updateData({ role: this.role });
  }

  updateDescription() {
    this.wizard.updateData({ description: this.description });
  }

  isValid(): boolean {
    return !!this.role && !!this.description;
  }
}
