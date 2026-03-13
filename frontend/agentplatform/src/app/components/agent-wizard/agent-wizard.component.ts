import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { WizardStateService } from '../../services/wizard-state.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { WizardStepNlpParserComponent } from '../../shared/components/wizard-steps/wizard-step-nlp-parser.component';
import { WizardStepGoalsComponent } from '../../shared/components/wizard-steps/wizard-step-goals.component';
import { WizardStepRoleComponent } from '../../shared/components/wizard-steps/wizard-step-role.component';
import { WizardStepCapabilitiesComponent } from '../../shared/components/wizard-steps/wizard-step-capabilities.component';
import { WizardStepToolsComponent } from '../../shared/components/wizard-steps/wizard-step-tools.component';
import { WizardStepCollaborationComponent } from '../../shared/components/wizard-steps/wizard-step-collaboration.component';
import { WizardStepApprovalsComponent } from '../../shared/components/wizard-steps/wizard-step-approvals.component';
import { WizardStepMemoryComponent } from '../../shared/components/wizard-steps/wizard-step-memory.component';
import { WizardStepModelComponent } from '../../shared/components/wizard-steps/wizard-step-model.component';
import { WizardStepReviewComponent } from '../../shared/components/wizard-steps/wizard-step-review.component';

@Component({
  selector: 'app-agent-wizard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    WizardStepNlpParserComponent,
    WizardStepGoalsComponent,
    WizardStepRoleComponent,
    WizardStepCapabilitiesComponent,
    WizardStepToolsComponent,
    WizardStepCollaborationComponent,
    WizardStepApprovalsComponent,
    WizardStepMemoryComponent,
    WizardStepModelComponent,
    WizardStepReviewComponent
  ],
  exportAs: 'app-agent-wizard',
  template: `
    <app-page-header title="Create Agent" subtitle="Multi-step wizard to define your agent">
      <button (click)="cancel()" class="btn btn-secondary">Cancel</button>
    </app-page-header>

    <div class="wizard-container">
      <!-- Progress bar -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="wizard.getProgressPercent()"></div>
        </div>
        <div class="progress-text">
          Step {{ wizard.currentStep() }} of {{ wizard.totalSteps }}
        </div>
      </div>

      <!-- Step indicator -->
      <div class="steps-indicator">
        @for (step of stepLabels; let i = $index; track i) {
          <button 
            [class.active]="wizard.currentStep() === i + 1"
            [class.completed]="wizard.currentStep() > i + 1"
            (click)="wizard.goToStep(i + 1)"
            class="step-dot"
            [title]="step"
          >
            {{ i + 1 }}
          </button>
        }
      </div>

      <!-- Step content -->
      <div class="step-content">
        @if (wizard.currentStep() === 1) {
          <app-wizard-step-nlp-parser (parseCompleted)="onParseCompleted()"></app-wizard-step-nlp-parser>
        }
        @if (wizard.currentStep() === 2) {
          <app-wizard-step-goals></app-wizard-step-goals>
        }
        @if (wizard.currentStep() === 3) {
          <app-wizard-step-role></app-wizard-step-role>
        }
        @if (wizard.currentStep() === 4) {
          <app-wizard-step-capabilities></app-wizard-step-capabilities>
        }
        @if (wizard.currentStep() === 5) {
          <app-wizard-step-tools></app-wizard-step-tools>
        }
        @if (wizard.currentStep() === 6) {
          <app-wizard-step-collaboration></app-wizard-step-collaboration>
        }
        @if (wizard.currentStep() === 7) {
          <app-wizard-step-approvals></app-wizard-step-approvals>
        }
        @if (wizard.currentStep() === 8) {
          <app-wizard-step-memory></app-wizard-step-memory>
        }
        @if (wizard.currentStep() === 9) {
          <app-wizard-step-model></app-wizard-step-model>
        }
        @if (wizard.currentStep() === 10) {
          <app-wizard-step-review (submit)="submitAgent()"></app-wizard-step-review>
        }
      </div>

      <!-- Navigation buttons -->
      <div class="wizard-actions">
        <button 
          (click)="wizard.previousStep()" 
          [disabled]="wizard.currentStep() === 1"
          class="btn btn-secondary"
        >
          ← Back
        </button>
        <button 
          (click)="wizard.nextStep()" 
          [disabled]="!wizard.canProceedFromStep(wizard.currentStep()) || wizard.currentStep() === 10"
          class="btn btn-primary"
        >
          Next →
        </button>
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
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.85rem;
      color: #666;
      text-align: center;
    }

    .steps-indicator {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 0.5rem;
    }

    .step-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #d0d0d0;
      background: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      color: #666;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .step-dot.active {
      background: #667eea;
      border-color: #667eea;
      color: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    }

    .step-dot.completed {
      background: #4caf50;
      border-color: #4caf50;
      color: white;
    }

    .step-content {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      min-height: 300px;
    }

    .wizard-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
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
      min-width: 120px;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      flex: 1;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #d0d0d0;
      flex: 1;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #efefef;
    }

    @media (max-width: 640px) {
      .wizard-container {
        padding: 0 1rem;
      }

      .steps-indicator {
        flex-wrap: wrap;
      }

      .step-dot {
        width: 32px;
        height: 32px;
        font-size: 0.8rem;
      }

      .step-content {
        padding: 1.5rem;
        min-height: auto;
      }
    }
  `]
})
export class AgentWizardComponent implements OnInit {
  wizard: WizardStateService = inject(WizardStateService);
  router = inject(Router);
  private agentService = inject(AgentService);

  ngOnInit(): void {
    // Initialize wizard state if needed
    this.wizard.totalSteps = 10;
  }

  stepLabels = [
    'Describe',
    'Goals',
    'Role',
    'Capabilities',
    'Tools',
    'Collaboration',
    'Approvals',
    'Memory',
    'Model',
    'Review'
  ];

  onParseCompleted() {
    this.wizard.nextStep();
  }

  submitAgent() {
    const data = this.wizard.data();
    // Build agent payload from complete wizard data
    const agentData = {
      name: data.name || data.role || 'New Agent',
      description: data.description || data.goal || '',
      goal: data.goal,
      goalCategory: data.goalCategory,
      role: data.role,
      capabilities: data.capabilities || [],
      allowedTools: data.allowedTools || [],
      workAlone: data.workAlone ?? true,
      collaboration: data.collaboration || [],
      approveEveryAction: data.approveEveryAction ?? false,
      rememberApprovals: data.rememberApprovals ?? false,
      enableMemory: data.enableMemory ?? true,
      memoryType: data.memoryType || 'short-term',
      modelPreference: data.modelPreference || 'balanced'
    };
    
    this.agentService.create(agentData).subscribe({
      next: () => {
        // Reset wizard state
        this.wizard.data.set({});
        this.wizard.currentStep.set(1);
        this.router.navigateByUrl('/agents');
      },
      error: (err) => {
        console.error('Failed to create agent:', err);
        alert('Error creating agent: ' + (err.error?.message || err.message));
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/agents');
  }
}
