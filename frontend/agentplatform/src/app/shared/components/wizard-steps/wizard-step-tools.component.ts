import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Select Allowed Tools</h2>
      <p class="subtitle">What tools can this agent use?</p>

      <div class="tools-grid">
        <button 
          *ngFor="let tool of allTools"
          (click)="toggleTool(tool)"
          [class.selected]="isSelected(tool)"
          class="tool-btn"
        >
          {{ tool }}
          <span class="checkmark" *ngIf="isSelected(tool)">✓</span>
        </button>
      </div>

      <div class="validation-status" *ngIf="!isValid()">
        <span class="status-icon">⚠️</span>
        <span>Select at least one tool to continue</span>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .tool-btn {
      padding: 0.75rem;
      border: 2px solid #d0d0d0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .tool-btn:hover {
      border-color: #667eea;
      background: #f5f5ff;
    }

    .tool-btn.selected {
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
export class WizardStepToolsComponent implements OnInit {
  wizard = inject(WizardStateService);
  
  allTools = [
    'Email',
    'Calendar',
    'Files',
    'Web Search',
    'Database',
    'API Calls',
    'Notifications',
    'Chat',
    'Analytics'
  ];

  selectedTools: string[] = [];

  ngOnInit() {
    const data = this.wizard.data();
    this.selectedTools = data.allowedTools || [];
  }

  toggleTool(tool: string) {
    const index = this.selectedTools.indexOf(tool);
    if (index > -1) {
      this.selectedTools.splice(index, 1);
    } else {
      this.selectedTools.push(tool);
    }
    this.wizard.updateData({ allowedTools: this.selectedTools });
  }

  isSelected(tool: string): boolean {
    return this.selectedTools.includes(tool);
  }

  isValid(): boolean {
    return this.selectedTools.length > 0;
  }
}
