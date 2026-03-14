import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WizardStateService } from '../../services/wizard-state.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

// Step components
import { WizardStepGoalComponent } from './wizard-steps/wizard-step-goal.component';
import { WizardStepRoleComponent } from './wizard-steps/wizard-step-role.component';
import { WizardStepCapabilitiesComponent } from './wizard-steps/wizard-step-capabilities.component';
import { WizardStepToolsComponent } from './wizard-steps/wizard-step-tools.component';
import { WizardStepApprovalsComponent } from './wizard-steps/wizard-step-approvals.component';
import { WizardStepMemoryComponent } from './wizard-steps/wizard-step-memory.component';
import { WizardStepModelComponent } from './wizard-steps/wizard-step-model.component';
import { WizardStepReviewComponent } from './wizard-steps/wizard-step-review.component';

@Component({
  selector: 'app-agent-wizard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    WizardStepGoalComponent,
    WizardStepRoleComponent,
    WizardStepCapabilitiesComponent,
    WizardStepToolsComponent,
    WizardStepApprovalsComponent,
    WizardStepMemoryComponent,
    WizardStepModelComponent,
    WizardStepReviewComponent
  ],
  template: `
    <app-page-header 
      title="Create Agent with Wizard" 
      subtitle="Build your agent step by step">
      <a routerLink="/agents" class="btn btn-secondary">Cancel</a>
    </app-page-header>

    <div class="wizard-container">
      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            [style.width.%]="wizardState.getProgressPercent()">
          </div>
        </div>
        <div class="progress-text">
          Step {{ wizardState.currentStep() }} of {{ wizardState.totalSteps }}
          ({{ wizardState.getProgressPercent() }}% complete)
        </div>
      </div>

      <!-- Steps -->
      <div class="wizard-steps">
        @switch(wizardState.currentStep()) {
          @case(1) {
            <app-wizard-step-goal (proceedClick)="onStepComplete()"></app-wizard-step-goal>
          }
          @case(2) {
            <app-wizard-step-role (proceedClick)="onStepComplete()"></app-wizard-step-role>
          }
          @case(3) {
            <app-wizard-step-capabilities (proceedClick)="onStepComplete()"></app-wizard-step-capabilities>
          }
          @case(4) {
            <app-wizard-step-tools (proceedClick)="onStepComplete()"></app-wizard-step-tools>
          }
          @case(5) {
            <app-wizard-step-approvals (proceedClick)="onStepComplete()"></app-wizard-step-approvals>
          }
          @case(6) {
            <app-wizard-step-memory (proceedClick)="onStepComplete()"></app-wizard-step-memory>
          }
          @case(7) {
            <app-wizard-step-model (proceedClick)="onStepComplete()"></app-wizard-step-model>
          }
          @case(8) {
            <app-wizard-step-review (proceedClick)="onStepComplete()"></app-wizard-step-review>
          }
          @default {
            <div class="error-message">Step not found</div>
          }
        }
      </div>

      <!-- Step Indicators -->
      <div class="step-indicators">
        @for (step of getStepLabels(); track $index) {
          <button 
            (click)="wizardState.goToStep($index + 1)"
            [class.active]="wizardState.currentStep() === $index + 1"
            [class.completed]="wizardState.currentStep() > $index + 1"
            class="step-indicator">
            {{ $index + 1 }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .wizard-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .progress-section {
      margin-bottom: 2rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .progress-text {
      text-align: center;
      color: #666;
      font-size: 0.85rem;
    }

    .wizard-steps {
      margin-bottom: 2rem;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .step-indicators {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .step-indicator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #d0d0d0;
      background: white;
      color: #999;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .step-indicator:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .step-indicator.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .step-indicator.completed {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
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
export class AgentWizardComponent {
  wizardState = inject(WizardStateService);
  router = inject(Router);

  ngOnInit() {
    this.wizardState.reset();
    this.wizardState.currentStep.set(1);
  }

  getStepLabels(): string[] {
    return ['Goal', 'Role', 'Capabilities', 'Tools', 'Approvals', 'Memory', 'Model', 'Review'];
  }

  onStepComplete() {
    // Each child component calls this when proceeding
  }
}
