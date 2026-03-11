import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../services/auth-store.service';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="top-nav">
      <div class="nav-left">
        <button class="menu-btn" (click)="toggleSidebar.emit()">
          <span>☰</span>
        </button>
        <div class="logo">AgentFlow</div>
      </div>
      
      <div class="nav-center">
        <div class="search-box">
          <input type="text" placeholder="Search agents, tasks...">
        </div>
      </div>
      
      <div class="nav-right">
        <div class="notification-badge">🔔</div>
        <div class="usage-meter">
          <span class="usage-label">5 / 5 uses</span>
        </div>
        <div class="user-menu" (click)="toggleUserMenu()">
          <span>👤</span>
          <div class="user-dropdown" [class.open]="userMenuOpen">
            <a href="/settings">Settings</a>
            <a href="/profile">Profile</a>
            <a href="/billing">Billing</a>
            <hr>
            <button (click)="logout()">Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .top-nav {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .nav-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 200px;
    }
    
    .menu-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      display: none;
    }
    
    .logo {
      font-size: 1.25rem;
      font-weight: 600;
      color: #667eea;
    }
    
    .nav-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .search-box {
      flex: 1;
      max-width: 300px;
    }
    
    .search-box input {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      background: #f5f5f5;
      font-size: 0.9rem;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
    }
    
    .nav-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      min-width: 200px;
      justify-content: flex-end;
    }
    
    .notification-badge,
    .usage-meter {
      font-size: 0.9rem;
      cursor: pointer;
    }
    
    .user-menu {
      position: relative;
      cursor: pointer;
    }
    
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      min-width: 150px;
      display: none;
      flex-direction: column;
      z-index: 1000;
      margin-top: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .user-dropdown.open {
      display: flex;
    }
    
    .user-dropdown a,
    .user-dropdown button {
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      color: #333;
      font-size: 0.9rem;
      text-decoration: none;
    }
    
    .user-dropdown a:hover,
    .user-dropdown button:hover {
      background: #f5f5f5;
    }
    
    .user-dropdown hr {
      margin: 0.5rem 0;
      border: none;
      border-top: 1px solid #e0e0e0;
    }
    
    @media (max-width: 768px) {
      .menu-btn { display: block; }
      .nav-center { display: none; }
      .nav-left { min-width: auto; }
      .nav-right { min-width: auto; gap: 1rem; }
    }
  `]
})
export class TopNavComponent {
  toggleSidebar = output<void>();
  userMenuOpen = false;
  
  private router = inject(Router);
  private authStore = inject(AuthStoreService);

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  
  logout() {
    this.authStore.clear();
    this.router.navigateByUrl('/signup');
  }
}
