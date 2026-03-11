import { Component, inject, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step">
      <h2>Review & Create Agent</h2>
      <p class="subtitle">Confirm your agent configuration</p>

      <div class="review-sections">
        <div class="review-section">
          <h3>Goal</h3>
          <div class="review-item">
            <span class="label">Goal:</span>
            <span class="value">{{ data.goal }}</span>
          </div>
          <div class="review-item">
            <span class="label">Category:</span>
            <span class="value">{{ data.goalCategory }}</span>
          </div>
        </div>

        <div class="review-section">
          <h3>Role</h3>
          <div class="review-item">
            <span class="label">Role:</span>
            <span class="value">{{ data.role }}</span>
          </div>
          <div class="review-item">
            <span class="label">Description:</span>
            <span class="value">{{ data.description }}</span>
          </div>
        </div>

        <div class="review-section">
          <h3>Capabilities</h3>
          <div class="tags">
            <span *ngFor="let cap of data.capabilities" class="tag">{{ cap }}</span>
          </div>
        </div>

        <div class="review-section">
          <h3>Tools</h3>
          <div class="tags">
            <span *ngFor="let tool of data.allowedTools" class="tag">{{ tool }}</span>
          </div>
        </div>

        <div class="review-section">
          <h3>Settings</h3>
          <div class="review-item">
            <span class="label">Collaboration:</span>
            <span class="value">{{ data.workAlone ? 'Works alone' : 'Collaborates' }}</span>
          </div>
          <div class="review-item">
            <span class="label">Approvals:</span>
            <span class="value">
              {{ data.approveEveryAction ? 'Every action' : data.rememberApprovals ? 'Remember approvals' : 'Auto-execute' }}
            </span>
          </div>
          <div class="review-item">
            <span class="label">Memory:</span>
            <span class="value">{{ data.enableMemory ? data.memoryType : 'Disabled' }}</span>
          </div>
          <div class="review-item">
            <span class="label">Model:</span>
            <span class="value">{{ data.modelPreference }}</span>
          </div>
        </div>
      </div>

      <div class="confirmation-box">
        <div class="confirmation-icon">✓</div>
        <div>Ready to create this agent?</div>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    
    .review-sections {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .review-section {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      background: #fafafa;
    }

    .review-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .review-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #efefef;
      font-size: 0.9rem;
    }

    .review-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 100px;
    }

    .value {
      color: #333;
      flex: 1;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      background: #667eea;
      color: white;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .confirmation-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #e8f5e9;
      border: 2px solid #4caf50;
      border-radius: 8px;
      color: #2e7d32;
      font-weight: 500;
      text-align: center;
    }

    .confirmation-icon {
      font-size: 1.5rem;
      font-weight: 600;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepReviewComponent implements OnInit {
  wizard = inject(WizardStateService);
  submit = output<void>();
  
  get data() {
    return this.wizard.data();
  }

  ngOnInit() {
    // Component just displays, no action needed
  }
}
