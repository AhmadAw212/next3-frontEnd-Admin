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
  private tokenRefreshedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private tokenRefreshed$: Observable<boolean> =
    this.tokenRefreshedSubject.asObservable();

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
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          const expiredToken = error.headers.get('Expired-Token');
          if (expiredToken) {
            this.authService.logout(); // Logout user if the token is expired
            this.router.navigate(['/login']); // Navigate user to the login page
            this.alertifyService.dialogAlert('Session Expired');
            return throwError(() => error); // Return an error to propagate it further
          } else {
            return this.authService.refreshTokens().pipe(
              switchMap((refreshedToken) => {
                if (refreshedToken) {
                  this.tokenRefreshedSubject.next(true);
                  request = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${refreshedToken}`,
                    },
                  });
                  return next.handle(request);
                } else {
                  this.alertifyService.dialogAlert('Session Expired');
                  throw new Error('Token refresh failed');
                }
              })
            );
          }
        } else {
          throw error;
        }
      })
    );
  }

  shouldExcludeToken(url: string): boolean {
    return url.includes('/api/refresh/refreshtoken');
  }
}
