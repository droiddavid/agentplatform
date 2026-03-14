import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <div class="empty-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
      color: #666;
      min-height: 400px;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #333;
    }
    
    p {
      margin: 0 0 1.5rem 0;
      color: #666;
      max-width: 400px;
    }
    
    .empty-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class EmptyStateComponent {
  icon = input('📭');
  title = input('No items');
  message = input('No items found');
}
