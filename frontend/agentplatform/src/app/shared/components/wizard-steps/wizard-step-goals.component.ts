import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>What do you want help with?</h2>
      <p class="subtitle">Describe your goal or task</p>

      <div class="form-group">
        <label for="goal">Your Goal</label>
        <textarea 
          id="goal" 
          [(ngModel)]="goal" 
          (change)="updateGoal()"
          placeholder="e.g., Manage email inbox, Research market trends, Schedule meetings"
          rows="4"
          class="form-input"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select 
          id="category" 
          [(ngModel)]="category" 
          (change)="updateCategory()"
          class="form-input"
        >
          <option value="">Select a category</option>
          <option value="life">Personal Life</option>
          <option value="work">Work</option>
          <option value="business">Business</option>
          <option value="family">Family</option>
          <option value="content">Content Creation</option>
        </select>
      </div>

      <div class="validation-status" *ngIf="!isValid()">
        <span class="status-icon">⚠️</span>
        <span>Please fill in all fields to continue</span>
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

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      resize: vertical;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .validation-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 6px;
      color: #856404;
      font-size: 0.9rem;
    }

    .status-icon {
      font-size: 1.1rem;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class WizardStepGoalsComponent implements OnInit {
  wizard = inject(WizardStateService);
  goal = '';
  category = '';

  ngOnInit() {
    const data = this.wizard.data();
    this.goal = data.goal || '';
    this.category = data.goalCategory || '';
  }

  updateGoal() {
    this.wizard.updateData({ goal: this.goal });
  }

  updateCategory() {
    this.wizard.updateData({ goalCategory: this.category as any });
  }

  isValid(): boolean {
    return !!this.goal && !!this.category;
  }
}
