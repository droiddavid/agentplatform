import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStoreService } from './auth-store.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private store = inject(AuthStoreService);
  private auth = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.store.getAccessToken();
    console.log('AuthInterceptor.intercept() - URL:', req.url, 'Token exists:', !!token);
    let authReq = req;
    
    // Don't attach token to public auth endpoints
    const publicAuthEndpoints = ['/api/auth/signin', '/api/auth/signup', '/api/auth/refresh'];
    const isPublicAuth = publicAuthEndpoints.some(endpoint => req.url.includes(endpoint));
    
    if (token && !isPublicAuth) {
      console.log('AuthInterceptor - attaching Authorization header with token:', token.substring(0, 20) + '...');
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      console.log('AuthInterceptor - Authorization header set:', authReq.headers.get('Authorization')?.substring(0, 30) + '...');
    } else if (isPublicAuth) {
      console.log('AuthInterceptor - skipping token for public auth endpoint:', req.url);
    }
    return next.handle(authReq).pipe(
      catchError(err => {
        console.log('AuthInterceptor - Error caught, status:', err?.status);
        if (err?.status === 401) {
          console.log('AuthInterceptor - 401 Unauthorized, attempting token refresh');
          const refresh = this.store.getRefreshToken();
          if (!refresh) {
            console.log('AuthInterceptor - No refresh token found, returning error');
            return throwError(() => err);
          }
          console.log('AuthInterceptor - Calling refresh with refresh token:', refresh.substring(0, 20) + '...');
          return this.auth.refresh(refresh).pipe(
            switchMap(r => {
              console.log('AuthInterceptor - Refresh successful, retrying original request');
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${r.accessToken}` } });
              return next.handle(retryReq);
            }),
            catchError(e => {
              console.log('AuthInterceptor - Refresh failed, clearing tokens. Error:', e);
              this.store.clear();
              return throwError(() => e);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}

export const authInterceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
