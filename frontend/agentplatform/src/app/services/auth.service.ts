import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthStoreService } from './auth-store.service';

export interface SignUpRequest { email: string; password: string }
export interface SignInResponse { accessToken: string; refreshToken: string }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8083';

  constructor(private http: HttpClient, private store: AuthStoreService) {}

  signUp(req: SignUpRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/signup`, req);
  }

  signIn(req: SignUpRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.baseUrl}/api/auth/signin`, req).pipe(
      tap(res => {
        console.log('SignIn tap - received response:', res);
        if (res && res.accessToken && res.refreshToken) {
          console.log('SignIn tap - calling setTokens');
          this.store.setTokens(res);
        } else {
          console.error('SignIn tap - missing tokens in response:', res);
        }
      })
    );
  }

  refresh(refreshToken: string): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.baseUrl}/api/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        console.log('Refresh tap - received response:', res);
        this.store.setTokens(res);
      })
    );
  }

  revoke(refreshToken: string) {
    return this.http.post(`${this.baseUrl}/api/auth/logout`, { refreshToken });
  }

  logout() {
    const r = this.store.getRefreshToken();
    if (r) {
      this.revoke(r).subscribe({ next: () => this.store.clear(), error: () => this.store.clear() });
    } else {
      this.store.clear();
    }
  }
}
