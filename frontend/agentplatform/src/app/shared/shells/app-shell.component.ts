import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-layout">
      <header class="top-nav">
        <div class="nav-left">
          <h1 class="logo">AgentFlow</h1>
        </div>
        <div class="nav-center">
          <input type="text" placeholder="Search agents..." class="search-input" />
        </div>
        <div class="nav-right">
          <button class="nav-button">🔔</button>
          <button class="nav-button">👤 Account</button>
        </div>
      </header>
      <div class="app-content">
        <nav class="side-nav" [class.collapsed]="sidebarCollapsed()">
          <ul class="nav-list">
            <li><a href="/dashboard">📊 Dashboard</a></li>
            <li><a href="/agents">🤖 Agents</a></li>
            <li><a href="/tasks">✓ Tasks</a></li>
            <li><a href="/runs">⚡ Runs</a></li>
            <li><a href="/approvals">✋ Approvals</a></li>
            <li><a href="/connections">🔌 Connections</a></li>
            <li><a href="/documents">📄 Documents</a></li>
            <li><a href="/billing">💳 Billing</a></li>
            <li><a href="/settings">⚙️ Settings</a></li>
            <li><a href="/help">❓ Help</a></li>
          </ul>
        </nav>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .top-nav {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .logo {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #667eea;
    }

    .nav-left, .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-center {
      flex: 1;
    }

    .search-input {
      width: 300px;
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .nav-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .nav-button:hover {
      background: #f5f5f5;
    }

    .app-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .side-nav {
      width: 200px;
      background: white;
      border-right: 1px solid #e0e0e0;
      overflow-y: auto;
      transition: width 0.3s ease;
    }

    .side-nav.collapsed {
      width: 60px;
    }

    .nav-list {
      list-style: none;
      padding: 1rem 0;
      margin: 0;
    }

    .nav-list li a {
      display: block;
      padding: 0.75rem 1rem;
      color: #333;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .nav-list li a:hover {
      background: #f5f5f5;
      color: #667eea;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #f5f5f5;
    }

    @media (max-width: 768px) {
      .app-layout {
        height: auto;
      }

      .top-nav {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-center {
        width: 100%;
      }

      .search-input {
        width: 100%;
      }

      .app-content {
        flex-direction: column;
      }

      .side-nav {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
      }
    }
  `]
})
export class AppShellComponent {
  sidebarCollapsed = signal(false);
}
