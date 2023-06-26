import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
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
          this.authService.refreshTokens();
        }
        throw error;
      })
    );
  }

  shouldExcludeToken(url: string): boolean {
    return url.includes('/api/refresh/refreshtoken');
  }
}
