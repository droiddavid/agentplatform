import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <div class="error-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
      color: #d32f2f;
      min-height: 400px;
      background: #ffebee;
      border-radius: 8px;
    }
    
    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.7;
    }
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #d32f2f;
    }
    
    p {
      margin: 0 0 1.5rem 0;
      color: #c62828;
      max-width: 400px;
    }
    
    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class ErrorStateComponent {
  title = input('Error');
  message = input('Something went wrong');
}
