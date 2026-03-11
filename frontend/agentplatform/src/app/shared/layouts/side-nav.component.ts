import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside class="side-nav" [class.open]="isOpen()">
      <nav class="nav-menu">
        <div class="nav-section">
          <div class="section-title">Main</div>
          <a *ngFor="let item of mainItems" 
             [routerLink]="item.path" 
             class="nav-item">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </div>
        
        <div class="nav-section">
          <div class="section-title">Workspace</div>
          <a *ngFor="let item of workspaceItems" 
             [routerLink]="item.path" 
             class="nav-item">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </div>
        
        <div class="nav-section">
          <div class="section-title">Account</div>
          <a *ngFor="let item of accountItems" 
             [routerLink]="item.path" 
             class="nav-item">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .side-nav {
      width: 240px;
      background: #fff;
      border-right: 1px solid #e0e0e0;
      overflow-y: auto;
      padding: 1rem 0;
      transition: all 0.3s ease;
    }
    
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .nav-section {
      padding: 0 1rem;
    }
    
    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #999;
      letter-spacing: 0.5px;
      margin-bottom: 0.75rem;
      padding: 0 0.5rem;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0.5rem;
      text-decoration: none;
      color: #333;
      font-size: 0.95rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .nav-item:hover {
      background: #f5f5f5;
      color: #667eea;
    }
    
    .nav-item.active {
      background: #f0f2ff;
      color: #667eea;
      font-weight: 500;
    }
    
    .nav-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
    }
    
    .nav-label {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      .side-nav {
        position: fixed;
        left: -240px;
        top: 60px;
        height: calc(100vh - 60px);
        z-index: 999;
        transition: left 0.3s ease;
      }
      
      .side-nav.open {
        left: 0;
      }
    }
  `]
})
export class SideNavComponent {
  isOpen = input(true);

  mainItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Agents', path: '/agents', icon: '🤖' },
    { label: 'Tasks', path: '/tasks', icon: '✓' },
    { label: 'Runs', path: '/runs', icon: '▶' },
  ];

  workspaceItems: NavItem[] = [
    { label: 'Approvals', path: '/approvals', icon: '✋' },
    { label: 'Connections', path: '/connections', icon: '🔗' },
    { label: 'Documents', path: '/documents', icon: '📄' },
  ];

  accountItems: NavItem[] = [
    { label: 'Billing', path: '/billing', icon: '💳' },
    { label: 'Privacy', path: '/privacy', icon: '🔒' },
    { label: 'Settings', path: '/settings', icon: '⚙' },
    { label: 'Help', path: '/help', icon: '❓' },
  ];
}
