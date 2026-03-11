import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../services/wizard-state.service';

@Component({
  selector: 'app-wizard-step-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Model Preference</h2>
      <p class="subtitle">How should the agent balance speed and accuracy?</p>

      <div class="models-grid">
        <button 
          (click)="selectModel('fast')"
          [class.selected]="selectedModel === 'fast'"
          class="model-card"
        >
          <div class="model-icon">⚡</div>
          <div class="model-name">Fast</div>
          <div class="model-desc">Quick responses, good for simple tasks</div>
          <div class="model-tradeoff">Low latency • Basic reasoning</div>
        </button>

        <button 
          (click)="selectModel('balanced')"
          [class.selected]="selectedModel === 'balanced'"
          class="model-card"
        >
          <div class="model-icon">⚖️</div>
          <div class="model-name">Balanced</div>
          <div class="model-desc">Default choice, good for most tasks</div>
          <div class="model-tradeoff">Normal latency • Good reasoning</div>
        </button>

        <button 
          (click)="selectModel('accurate')"
          [class.selected]="selectedModel === 'accurate'"
          class="model-card"
        >
          <div class="model-icon">🎯</div>
          <div class="model-name">Accurate</div>
          <div class="model-desc">Thorough analysis, best for complex tasks</div>
          <div class="model-tradeoff">Higher latency • Advanced reasoning</div>
        </button>
      </div>

      <div class="info-box">
        <span>💡</span>
        <span>You can change this anytime in agent settings</span>
      </div>
    </div>
  `,
  styles: [`
    .step { animation: slideIn 0.3s ease; }
    h2 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .subtitle { margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem; }
    
    .models-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .model-card {
      padding: 1.5rem;
      border: 2px solid #d0d0d0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .model-card:hover {
      border-color: #667eea;
      background: #f5f5ff;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .model-card.selected {
      background: #667eea;
      border-color: #667eea;
      color: white;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .model-icon {
      font-size: 2rem;
    }

    .model-name {
      font-size: 1rem;
      font-weight: 600;
    }

    .model-desc {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    .model-tradeoff {
      font-size: 0.75rem;
      opacity: 0.7;
      padding-top: 0.5rem;
      border-top: 1px solid;
      border-color: rgba(0, 0, 0, 0.1);
    }

    .model-card.selected .model-tradeoff {
      border-color: rgba(255, 255, 255, 0.3);
    }

    .info-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f3e5f5;
      border: 1px solid #9c27b0;
      border-radius: 6px;
      color: #6a1b9a;
      font-size: 0.9rem;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class WizardStepModelComponent implements OnInit {
  wizard = inject(WizardStateService);
  
  selectedModel = 'balanced';

  ngOnInit() {
    const data = this.wizard.data();
    this.selectedModel = data.modelPreference || 'balanced';
  }

  selectModel(model: string) {
    this.selectedModel = model;
    this.wizard.updateData({ modelPreference: model as any });
  }
}
