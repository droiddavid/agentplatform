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
    let authReq = req;
    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(authReq).pipe(
      catchError(err => {
        if (err?.status === 401) {
          const refresh = this.store.getRefreshToken();
          if (!refresh) return throwError(() => err);
          return this.auth.refresh(refresh).pipe(
            switchMap(r => {
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${r.accessToken}` } });
              return next.handle(retryReq);
            }),
            catchError(e => {
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
