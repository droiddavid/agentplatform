import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStoreService } from './auth-store.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: AuthStoreService, private router: Router) {}
  canActivate(): boolean {
    const t = this.store.getAccessToken();
    if (!t) { this.router.navigateByUrl('/signup'); return false; }
    return true;
  }
}
