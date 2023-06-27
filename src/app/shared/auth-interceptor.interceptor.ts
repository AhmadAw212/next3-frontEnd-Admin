import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  filter,
  from,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AlertifyService } from '../services/alertify.service';
@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token && !this.shouldExcludeToken(request.url)) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          const isTokenExpired = this.authService.isTokenExpired(token!);

          if (isTokenExpired) {
            this.authService.logout();
            this.router.navigate(['/login']);
            this.alertifyService.dialogAlert('Session Expired');
            return throwError(() => error);
          } else if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshTokens().pipe(
              switchMap((refreshedToken) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(refreshedToken);
                return next.handle(
                  this.addTokenToRequest(request, refreshedToken)
                );
              }),
              catchError((refreshError) => {
                this.isRefreshing = false;
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(() => refreshError);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              switchMap((token) => {
                if (token) {
                  return next.handle(this.addTokenToRequest(request, token));
                } else {
                  // If the refresh token subject emits a null token, it means the token refresh failed.
                  this.authService.logout();
                  this.router.navigate(['/login']);
                  return throwError(() => new Error('Token refresh failed'));
                }
              })
            );
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private shouldExcludeToken(url: string): boolean {
    return url.includes('/api/refresh/refreshtoken');
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
