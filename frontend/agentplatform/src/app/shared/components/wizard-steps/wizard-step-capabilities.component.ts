import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-capabilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Select Agent Capabilities</h2>
      <p class="subtitle">What should this agent be able to do?</p>

      <div class="capabilities-grid">
        <button 
          *ngFor="let cap of allCapabilities"
          (click)="toggleCapability(cap)"
          [class.selected]="isSelected(cap)"
          class="capability-btn"
        >
          {{ cap }}
          <span class="checkmark" *ngIf="isSelected(cap)">✓</span>
        </button>
      </div>

      <div class="validation-status" *ngIf="!isValid()">
        <span class="status-icon">⚠️</span>
        <span>Select at least one capability to continue</span>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    
    .capabilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .capability-btn {
      padding: 1rem;
      border: 2px solid #d0d0d0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .capability-btn:hover {
      border-color: #667eea;
      background: #f5f5ff;
    }

    .capability-btn.selected {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }

    .checkmark {
      margin-left: 0.25rem;
      font-weight: 600;
    }

    .validation-status {
      display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
      background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; color: #856404; font-size: 0.9rem;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepCapabilitiesComponent implements OnInit {
  wizard = inject(WizardStateService);
  
  allCapabilities = [
    'Analyze Data',
    'Generate Content',
    'Schedule Tasks',
    'Send Messages',
    'Research',
    'Summarize',
    'Translate',
    'Code Review',
    'Planning',
    'Monitoring',
    'Reporting',
    'Learning'
  ];

  selectedCapabilities: string[] = [];

  ngOnInit() {
    const data = this.wizard.data();
    this.selectedCapabilities = data.capabilities || [];
  }

  toggleCapability(cap: string) {
    const index = this.selectedCapabilities.indexOf(cap);
    if (index > -1) {
      this.selectedCapabilities.splice(index, 1);
    } else {
      this.selectedCapabilities.push(cap);
    }
    this.wizard.updateData({ capabilities: this.selectedCapabilities });
  }

  isSelected(cap: string): boolean {
    return this.selectedCapabilities.includes(cap);
  }

  isValid(): boolean {
    return this.selectedCapabilities.length > 0;
  }
}
