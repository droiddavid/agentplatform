import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-goal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>What is your primary goal?</h2>
        <p>Help us understand what you want to achieve</p>
      </div>

      <div class="form-group">
        <label>Select a goal category</label>
        <div class="category-buttons">
          <button 
            *ngFor="let cat of categories"
            [class.active]="wizardState.data().goalCategory === cat.value"
            (click)="updateCategory(cat.value)"
            class="category-btn">
            <span class="icon">{{ cat.icon }}</span>
            <span class="label">{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="goal">Describe your goal</label>
        <textarea 
          id="goal"
          [(ngModel)]="currentGoal"
          placeholder="e.g., I want to organize my daily tasks and get reminders"
          rows="5"
          class="form-textarea">
        </textarea>
      </div>

      <div class="step-actions">
        <button class="btn btn-primary" (click)="proceed()" [disabled]="!canProceed()">
          Next: Role & Description
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

    .form-group label {
      display: block;
      margin-bottom: 1rem;
      color: #333;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .category-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .category-btn {
      padding: 1.5rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .category-btn:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .category-btn.active {
      border-color: #667eea;
      background: #667eea;
      color: white;
    }

    .category-btn .icon {
      font-size: 2rem;
    }

    .category-btn .label {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.95rem;
      resize: vertical;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  `]
})
export class WizardStepGoalComponent {
  wizardState = inject(WizardStateService);
  proceedClick = output<void>();

  currentGoal = '';

  categories = [
    { value: 'life', label: 'Personal', icon: '👤' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'business', label: 'Business', icon: '🏢' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'content', label: 'Content', icon: '📝' }
  ];

  ngOnInit() {
    const d = this.wizardState.data();
    this.currentGoal = d.goal || '';
  }

  updateCategory(cat: string) {
    this.wizardState.updateData({ goalCategory: cat as any });
  }

  canProceed(): boolean {
    return !!this.wizardState.data().goalCategory && !!this.currentGoal.trim();
  }

  proceed() {
    this.wizardState.updateData({ goal: this.currentGoal });
    this.wizardState.nextStep();
    this.proceedClick.emit();
  }
}
