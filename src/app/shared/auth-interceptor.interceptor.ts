import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  from,
  switchMap,
  take,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private tokenRefreshedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private tokenRefreshed$: Observable<boolean> =
    this.tokenRefreshedSubject.asObservable();

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the Authorization header if a token exists
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
        // Check for unauthorized error and trigger token refresh
        if (error.status === 401) {
          return this.authService.refreshTokens().pipe(
            switchMap((refreshedToken) => {
              if (refreshedToken) {
                // Emit the refreshed token value
                this.tokenRefreshedSubject.next(true);

                // Retry the original request with the updated token
                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${refreshedToken}`,
                  },
                });
                return next.handle(request);
              } else {
                // Handle the case where token refresh failed
                throw new Error('Token refresh failed');
              }
            })
          );
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
