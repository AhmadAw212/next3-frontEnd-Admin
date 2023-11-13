import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { EMPTY } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private tokenRefreshInProgress = false;
  private tokenRefreshSubject: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request is for the token refresh endpoint, and skip adding the token if it is
    if (request.url.includes('/refreshtoken')) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
    if (token) {
      // Clone the request and add the Authorization header with the token
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (!this.tokenRefreshInProgress) {
            this.tokenRefreshInProgress = true;

            return this.authService.refreshTokens().pipe(
              switchMap((response: any) => {
                this.tokenRefreshInProgress = false;
                // Refresh token successful, update the token in local storage
                localStorage.setItem('token', response.token);

                // Notify other requests that the token has been refreshed
                this.tokenRefreshSubject.next(response.token);

                // Clone the original request with the updated token and resend it
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`,
                  },
                });

                return next.handle(newRequest);
              }),
              catchError((refreshError: any) => {
                this.tokenRefreshInProgress = false;
                // Refresh token failed or expired as well, logout the user and redirect to login
                this.authService.logout();
                this.router.navigate(['/login']);
                this.alertifyService.dialogAlert(
                  'Session expired. Please log in again.',
                  'Timeout'
                );
                return throwError(() => refreshError);
              })
            );
          } else {
            // Token refresh is already in progress, wait for it to complete
            return this.tokenRefreshSubject.pipe(
              take(1),
              switchMap(() => {
                // Clone the original request with the updated token and resend it
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                });
                return next.handle(newRequest);
              })
            );
          }
        } else {
          // Handle other errors
          return throwError(() =>
            this.alertifyService.dialogAlert(
              error.error.message,
              error.error.error
            )
          );
        }
      })
    );
  }
}
