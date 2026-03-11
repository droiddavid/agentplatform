import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Approval Settings</h2>
      <p class="subtitle">How should this agent handle external actions?</p>

      <div class="setting">
        <h3>Action Approval Policy</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              name="approval-mode"
              [(ngModel)]="approvalMode"
              value="every"
              (change)="updateApprovals()"
            />
            <span class="label-content">
              <span class="title">Approve Every External Action</span>
              <span class="desc">You review every action before it happens</span>
            </span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="approval-mode"
              [(ngModel)]="approvalMode"
              value="remember"
              (change)="updateApprovals()"
            />
            <span class="label-content">
              <span class="title">Remember Approvals</span>
              <span class="desc">You approve once, agent remembers for similar actions</span>
            </span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="approval-mode"
              [(ngModel)]="approvalMode"
              value="none"
              (change)="updateApprovals()"
            />
            <span class="label-content">
              <span class="title">No Approval (Auto-execute)</span>
              <span class="desc">Agent acts autonomously, you monitor results</span>
            </span>
          </label>
        </div>
      </div>

      <div class="info-box">
        <span>💡</span>
        <span>External actions are API calls, emails, or any changes outside the system</span>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    
    .setting { margin-bottom: 1.5rem; }
    h3 { margin: 0 0 1rem 0; color: #333; font-size: 1rem; font-weight: 500; }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .radio-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      transition: all 0.2s ease;
      background: white;
    }

    .radio-label:hover {
      border-color: #667eea;
      background: #f5f5ff;
    }

    .radio-label input[type="radio"] {
      cursor: pointer;
      accent-color: #667eea;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .label-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .title {
      color: #333;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .desc {
      color: #666;
      font-size: 0.85rem;
    }

    .info-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #e8f5e9;
      border: 1px solid #4caf50;
      border-radius: 6px;
      color: #2e7d32;
      font-size: 0.9rem;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepApprovalsComponent implements OnInit {
  wizard = inject(WizardStateService);
  
  approvalMode = 'remember';

  ngOnInit() {
    const data = this.wizard.data();
    if (data.approveEveryAction) {
      this.approvalMode = 'every';
    } else if (data.rememberApprovals) {
      this.approvalMode = 'remember';
    } else {
      this.approvalMode = 'none';
    }
  }

  updateApprovals() {
    const approveEvery = this.approvalMode === 'every';
    const remember = this.approvalMode === 'remember';
    this.wizard.updateData({
      approveEveryAction: approveEvery,
      rememberApprovals: remember
    });
  }
}
