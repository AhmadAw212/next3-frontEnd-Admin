import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { EMPTY } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private refreshingToken = false;

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
          if (!this.refreshingToken) {
            this.refreshingToken = true;

            return this.authService.refreshTokens().pipe(
              switchMap((response: any) => {
                this.refreshingToken = false;
                // Refresh token successful, update the token in local storage
                localStorage.setItem('token', response.token);

                // Clone the original request with the updated token and resend it
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`,
                  },
                });

                return next.handle(newRequest);
              }),
              catchError((refreshError: any) => {
                this.refreshingToken = false;
                // Refresh token failed or expired as well, logout the user and redirect to login
                localStorage.removeItem('token'); // Remove the expired token
                this.router.navigate(['/login']);
                this.alertifyService.dialogAlert(
                  'Session expired. Please log in again.'
                );
                return throwError(() => refreshError);
              })
            );
          } else {
            // Token refresh is already in progress, return an empty observable to prevent infinite loop
            return EMPTY;
          }
        } else {
          // Handle other errors
          return throwError(() => error);
        }
      })
    );
  }
}
