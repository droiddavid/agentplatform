import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      min-height: 400px;
      color: #666;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      margin-bottom: 1rem;
      border: 4px solid #f0f0f0;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    p {
      margin: 0;
      font-size: 0.95rem;
      color: #999;
    }
  `]
})
export class LoadingStateComponent {
  message = input('Loading...');
}
