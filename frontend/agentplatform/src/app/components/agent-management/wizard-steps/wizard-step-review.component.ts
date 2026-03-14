import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';
import { AgentService } from '../../../services/agent.service';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wizard-step-review',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingStateComponent],
  template: `
    <div class="wizard-card">
      <div class="step-header">
        <h2>Review & Create Agent</h2>
        <p>Verify all settings before creating your agent</p>
      </div>

      @if (loading()) {
        <app-loading-state message="Creating your agent..."></app-loading-state>
      }

      @if (!loading()) {
        <div class="review-sections">
          <div class="review-section">
            <h3>📋 Goal & Role</h3>
            <p><strong>Category:</strong> {{ wizardState.data().goalCategory }}</p>
            <p><strong>Goal:</strong> {{ wizardState.data().goal }}</p>
            <p><strong>Role:</strong> {{ wizardState.data().role }}</p>
            <p><strong>Description:</strong> {{ wizardState.data().description }}</p>
          </div>

          <div class="review-section">
            <h3>🔧 Capabilities & Tools</h3>
            <p><strong>Capabilities:</strong> {{ (wizardState.data().capabilities || []).join(', ') }}</p>
            <p><strong>Tools:</strong> {{ (wizardState.data().allowedTools || []).join(', ') }}</p>
          </div>

          <div class="review-section">
            <h3>⚙️ Behavior</h3>
            <p><strong>Approvals:</strong> {{ wizardState.data().approveEveryAction ? 'Ask for every action' : 'Proceed independently' }}</p>
            <p><strong>Remember Decisions:</strong> {{ wizardState.data().rememberApprovals ? 'Yes' : 'No' }}</p>
            <p><strong>Memory:</strong> {{ wizardState.data().enableMemory ? wizardState.data().memoryType + ' memory' : 'Disabled' }}</p>
            <p><strong>Model:</strong> {{ wizardState.data().modelPreference }}</p>
          </div>
        </div>

        @if (error()) {
          <div class="error-banner">
            <div class="error-icon">⚠️</div>
            <div>{{ error() }}</div>
          </div>
        }

        <div class="step-actions">
          <button class="btn btn-secondary" (click)="goBack()" [disabled]="loading()">Back</button>
          <button class="btn btn-primary" (click)="create()" [disabled]="loading()">
            Create Agent
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .wizard-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      max-width: 700px;
      margin: 0 auto;
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

    .review-sections {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .review-section {
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .review-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
      font-weight: 600;
    }

    .review-section p {
      margin: 0 0 0.75rem 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .review-section p:last-child {
      margin-bottom: 0;
    }

    .review-section strong {
      color: #333;
      font-weight: 600;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffebee;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #c62828;
      font-size: 0.9rem;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
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

    .btn-secondary:hover:not(:disabled) {
      background: #d0d0d0;
    }

    .btn-secondary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class WizardStepReviewComponent {
  wizardState = inject(WizardStateService);
  agentService = inject(AgentService);
  router = inject(Router);

  loading = signal(false);
  error = signal('');
  proceedClick = output<void>();

  async create() {
    this.loading.set(true);
    this.error.set('');

    try {
      const data = this.wizardState.data();
      const request = {
        name: data.role || 'New Agent',
        description: data.description || ''
      };

      await this.agentService.create(request).toPromise();

      this.wizardState.reset();
      await this.router.navigate(['/agents']);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Failed to create agent. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.wizardState.previousStep();
  }
}
