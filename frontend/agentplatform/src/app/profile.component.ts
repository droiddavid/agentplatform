import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStoreService } from './services/auth-store.service';
import { PageHeaderComponent } from './shared/components/page-header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Profile" subtitle="View and manage your account">
    </app-page-header>

    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-section">
          <h3>Account Information</h3>
          <div class="info-row">
            <label>Email Address</label>
            <p>{{ email() || 'Not available' }}</p>
          </div>
        </div>

        <div class="profile-section">
          <h3>Preferences</h3>
          <div class="info-row">
            <label>Theme</label>
            <select class="form-select">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>
          <div class="info-row">
            <label>Notifications</label>
            <input type="checkbox" checked="true" class="form-checkbox" />
            <span>Enable email notifications</span>
          </div>
        </div>

        <div class="profile-section danger">
          <h3>Danger Zone</h3>
          <p>These actions cannot be undone.</p>
          <button class="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .profile-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .profile-section {
      padding: 2rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .profile-section:last-child {
      border-bottom: none;
    }

    .profile-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
      font-weight: 600;
    }

    .profile-section p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .profile-section.danger {
      background: #fafafa;
    }

    .profile-section.danger h3 {
      color: #c62828;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-row label {
      font-weight: 500;
      color: #666;
      min-width: 120px;
    }

    .info-row p {
      flex: 1;
      margin: 0;
      color: #333;
    }

    .form-select,
    .form-checkbox {
      padding: 0.5rem;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .form-select {
      flex: 1;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }

    .btn-danger {
      background: #d32f2f;
      color: white;
    }

    .btn-danger:hover {
      background: #b71c1c;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
    }

    @media (max-width: 768px) {
      .profile-container {
        margin: 1rem auto;
      }

      .profile-section {
        padding: 1.5rem;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .info-row label {
        width: 100%;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private store = inject(AuthStoreService);
  email = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.store.getAccessToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.email.set(payload?.email || null);
    } catch (e) {
      this.email.set(null);
    }
  }
}
