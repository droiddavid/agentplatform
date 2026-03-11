import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <div class="signup-header">
          <h1>Create Your Account</h1>
          <p>Start building AI agents that work for you</p>
        </div>

        <form (ngSubmit)="submit()" class="signup-form">
          @if (error()) {
            <div class="error-banner">
              <div class="error-icon">⚠️</div>
              <div>{{ error() }}</div>
            </div>
          }

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              name="email" 
              [(ngModel)]="email" 
              placeholder="you@example.com"
              required 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              name="password" 
              [(ngModel)]="password" 
              placeholder="At least 8 characters"
              required 
              class="form-input"
            />
          </div>

          <button type="submit" [disabled]="loading()" class="btn btn-primary btn-large">
            {{ loading() ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="signup-footer">
          <p>Already have an account? <a routerLink="/signin" class="link">Sign In</a></p>
        </div>
      </div>

      <div class="signup-benefits">
        <h2>Why AgentFlow?</h2>
        <ul>
          <li>✨ Create agents without coding</li>
          <li>🔒 Stay in control with approvals</li>
          <li>👥 Build multi-agent teams</li>
          <li>🚀 Deploy instantly</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 2rem;
      min-height: 100vh;
      align-content: center;
    }

    .signup-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .signup-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .signup-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      color: #333;
    }

    .signup-header p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    .signup-form {
      margin-bottom: 1.5rem;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffebee;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #c62828;
      font-size: 0.9rem;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-large {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
    }

    .signup-footer {
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    .signup-benefits {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .signup-benefits h2 {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      color: white;
    }

    .signup-benefits ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .signup-benefits li {
      font-size: 1.1rem;
      color: white;
      margin-bottom: 1rem;
      opacity: 0.95;
    }

    @media (max-width: 1000px) {
      .signup-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .signup-benefits {
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      .signup-container {
        padding: 1.5rem;
        gap: 2rem;
      }

      .signup-card {
        padding: 1.5rem;
      }

      .signup-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class SignUpComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);

  submit() {
    this.error.set(null);
    this.loading.set(true);
    this.auth.signUp({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || err?.message || 'Signup failed');
      }
    });
  }
}
