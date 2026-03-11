import { Injectable, signal } from '@angular/core';

export interface WizardData {
  // Step 1: Goals
  goal?: string;
  goalCategory?: 'life' | 'work' | 'business' | 'family' | 'content';
  
  // Step 2: Role
  role?: string;
  description?: string;
  
  // Step 3: Capabilities
  capabilities?: string[];
  
  // Step 4: Tools
  allowedTools?: string[];
  
  // Step 5: Collaboration
  workAlone?: boolean;
  collaboration?: string[];
  
  // Step 6: Approvals
  approveEveryAction?: boolean;
  rememberApprovals?: boolean;
  
  // Step 7: Memory
  enableMemory?: boolean;
  memoryType?: 'short-term' | 'long-term' | 'both';
  
  // Step 8: Model
  modelPreference?: 'fast' | 'balanced' | 'accurate';
  
  // Step 9: Review handled by parent
}

@Injectable({
  providedIn: 'root'
})
export class WizardStateService {
  currentStep = signal(1);
  totalSteps = 9;
  data = signal<WizardData>({});

  constructor() {}

  updateData(partial: Partial<WizardData>) {
    const current = this.data();
    this.data.set({ ...current, ...partial });
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.set(this.currentStep() + 1);
      window.scrollTo(0, 0);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
      window.scrollTo(0, 0);
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
      window.scrollTo(0, 0);
    }
  }

  reset() {
    this.currentStep.set(1);
    this.data.set({});
  }

  getProgressPercent(): number {
    return Math.round((this.currentStep() / this.totalSteps) * 100);
  }

  canProceedFromStep(step: number): boolean {
    const d = this.data();
    switch (step) {
      case 1: return !!d.goal && !!d.goalCategory;
      case 2: return !!d.role && !!d.description;
      case 3: return !!(d.capabilities && d.capabilities.length > 0);
      case 4: return !!(d.allowedTools && d.allowedTools.length > 0);
      case 5: return d.workAlone !== undefined;
      case 6: return d.approveEveryAction !== undefined;
      case 7: return d.enableMemory !== undefined;
      case 8: return !!d.modelPreference;
      default: return true;
    }
  }
}
