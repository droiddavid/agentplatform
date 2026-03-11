import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-collaboration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Collaboration Settings</h2>
      <p class="subtitle">How should this agent interact with others?</p>

      <div class="setting">
        <h3>Work Preference</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              name="work-mode" 
              value="alone"
              [(ngModel)]="workMode"
              (change)="updateWorkAlone(true)"
            />
            <span>Work alone (independent)</span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="work-mode" 
              value="collaborate"
              [(ngModel)]="workMode"
              (change)="updateWorkAlone(false)"
            />
            <span>Collaborate with other agents</span>
          </label>
        </div>
      </div>

      <div class="setting" *ngIf="!workAlone">
        <h3>Collaboration Style</h3>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox"
              [(ngModel)]="shareKnowledge"
              (change)="updateCollaboration()"
            />
            <span>Share knowledge with peers</span>
          </label>
          <label class="checkbox-label">
            <input 
              type="checkbox"
              [(ngModel)]="canDelegate"
              (change)="updateCollaboration()"
            />
            <span>Can delegate tasks to other agents</span>
          </label>
          <label class="checkbox-label">
            <input 
              type="checkbox"
              [(ngModel)]="reportResults"
              (change)="updateCollaboration()"
            />
            <span>Report results back to coordinator</span>
          </label>
        </div>
      </div>

      <div class="validation-status" *ngIf="!isValid()">
        <span class="status-icon">⚠️</span>
        <span>Please select collaboration settings</span>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    
    .setting { margin-bottom: 1.5rem; }
    h3 { margin: 0 0 1rem 0; color: #333; font-size: 1rem; font-weight: 500; }

    .radio-group, .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .radio-label, .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .radio-label:hover, .checkbox-label:hover {
      background: #f5f5f5;
    }

    .radio-label input[type="radio"],
    .checkbox-label input[type="checkbox"] {
      cursor: pointer;
      accent-color: #667eea;
      width: 18px;
      height: 18px;
    }

    .radio-label span, .checkbox-label span {
      color: #333;
      font-size: 0.95rem;
    }

    .validation-status {
      display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
      background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; color: #856404; font-size: 0.9rem;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepCollaborationComponent implements OnInit {
  wizard = inject(WizardStateService);
  
  workMode = 'alone';
  workAlone = true;
  shareKnowledge = false;
  canDelegate = false;
  reportResults = false;

  ngOnInit() {
    const data = this.wizard.data();
    this.workAlone = data.workAlone !== false;
    this.workMode = this.workAlone ? 'alone' : 'collaborate';
    const collab = data.collaboration || [];
    this.shareKnowledge = collab.includes('share-knowledge');
    this.canDelegate = collab.includes('delegate');
    this.reportResults = collab.includes('report');
  }

  updateWorkAlone(value: boolean) {
    this.workAlone = value;
    this.wizard.updateData({ workAlone: value });
  }

  updateCollaboration() {
    const collab = [];
    if (this.shareKnowledge) collab.push('share-knowledge');
    if (this.canDelegate) collab.push('delegate');
    if (this.reportResults) collab.push('report');
    this.wizard.updateData({ collaboration: collab });
  }

  isValid(): boolean {
    return this.workAlone !== undefined;
  }
}
