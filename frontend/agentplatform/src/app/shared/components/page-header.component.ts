import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>{{ title() }}</h1>
          <p *ngIf="subtitle()" class="subtitle">{{ subtitle() }}</p>
        </div>
        <div class="header-actions">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .header-text h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #333;
      font-weight: 600;
    }
    
    .subtitle {
      margin: 0.5rem 0 0 0;
      color: #666;
      font-size: 0.95rem;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .header-text h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string | null>(null);
}
