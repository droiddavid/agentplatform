import { Injectable, inject } from '@angular/core';
import { AuthService, SignInResponse } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private accessKey = 'agent_access_token';
  private refreshKey = 'agent_refresh_token';
  private refreshTimer: any = null;

  constructor() {}

  setTokens(tokens: SignInResponse) {
    console.log('AuthStore.setTokens called with:', tokens);
    localStorage.setItem(this.accessKey, tokens.accessToken);
    localStorage.setItem(this.refreshKey, tokens.refreshToken);
    console.log('AuthStore.setTokens - tokens saved to localStorage');
    console.log('AuthStore verify - access token in storage:', localStorage.getItem(this.accessKey));
    this.scheduleRefresh(tokens.accessToken);
  }

  clear() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    if (this.refreshTimer) { clearTimeout(this.refreshTimer); this.refreshTimer = null; }
  }

  getAccessToken(): string | null { return localStorage.getItem(this.accessKey); }
  getRefreshToken(): string | null { return localStorage.getItem(this.refreshKey); }

  private decodeJwt(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) { return null; }
  }

  private scheduleRefresh(accessToken: string) {
    if (this.refreshTimer) { clearTimeout(this.refreshTimer); this.refreshTimer = null; }
    const payload = this.decodeJwt(accessToken);
    if (!payload || !payload.exp) return;
    const expiresAt = payload.exp * 1000;
    const now = Date.now();
    const buffer = 30 * 1000; // refresh 30s before expiry
    const ms = Math.max(1000, expiresAt - now - buffer);
    this.refreshTimer = setTimeout(() => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) { this.clear(); return; }
      // Use inject() here to avoid circular dependency at initialization
      const authService = inject(AuthService);
      authService.refresh(refreshToken).subscribe({
        next: (r) => this.setTokens(r),
        error: () => this.clear()
      });
    }, ms);
  }
}
