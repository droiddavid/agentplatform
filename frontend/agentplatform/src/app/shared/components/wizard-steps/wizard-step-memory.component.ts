import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-memory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Memory Settings</h2>
      <p class="subtitle">How should this agent remember information?</p>

      <div class="setting">
        <h3>Enable Memory</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              name="memory-enabled"
              [(ngModel)]="memoryEnabled"
              value="true"
              (change)="updateMemory()"
            />
            <span>Yes, enable memory</span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="memory-enabled"
              [(ngModel)]="memoryEnabled"
              value="false"
              (change)="updateMemory()"
            />
            <span>No, stateless agent</span>
          </label>
        </div>
      </div>

      <div class="setting" *ngIf="memoryEnabled === 'true'">
        <h3>Memory Type</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              name="memory-type"
              [(ngModel)]="memoryType"
              value="short-term"
              (change)="updateMemoryType()"
            />
            <span class="label-content">
              <span class="title">Short-term Memory</span>
              <span class="desc">Remember during current session only</span>
            </span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="memory-type"
              [(ngModel)]="memoryType"
              value="long-term"
              (change)="updateMemoryType()"
            />
            <span class="label-content">
              <span class="title">Long-term Memory</span>
              <span class="desc">Remember across sessions and tasks</span>
            </span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="memory-type"
              [(ngModel)]="memoryType"
              value="both"
              (change)="updateMemoryType()"
            />
            <span class="label-content">
              <span class="title">Both</span>
              <span class="desc">Short-term for speed, long-term for context</span>
            </span>
          </label>
        </div>
      </div>

      <div class="info-box">
        <span>💡</span>
        <span>Memory helps agents provide more personalized and context-aware responses</span>
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
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .radio-label:hover {
      border-color: #667eea;
      background: #f5f5ff;
    }

    .radio-label input[type="radio"] {
      cursor: pointer;
      accent-color: #667eea;
      width: 18px;
      height: 18px;
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
      background: #e3f2fd;
      border: 1px solid #2196f3;
      border-radius: 6px;
      color: #1565c0;
      font-size: 0.9rem;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepMemoryComponent implements OnInit {
  wizard = inject(WizardStateService);
  
  memoryEnabled = 'true';
  memoryType = 'both';

  ngOnInit() {
    const data = this.wizard.data();
    this.memoryEnabled = data.enableMemory !== false ? 'true' : 'false';
    this.memoryType = data.memoryType || 'both';
  }

  updateMemory() {
    this.wizard.updateData({ enableMemory: this.memoryEnabled === 'true' });
  }

  updateMemoryType() {
    this.wizard.updateData({ memoryType: this.memoryType as any });
  }
}
