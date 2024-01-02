import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { AlertifyService } from '../services/alertify.service';
import { TokenPayload } from '../model/token-payload';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: JwtPayload = jwtDecode(token);

      if (decodedToken && decodedToken.exp! * 1000 > Date.now()) {
        // Token is valid, allow access
        return true;
      } else {
        // Token has expired, initiate token refresh
        return this.authService.refreshTokens().pipe(
          switchMap(() => of(true)), // Continue with the guard when token refresh is successful
          catchError(() => {
            // Token refresh failed, logout the user and redirect to login
            // this.authService.logout();
            this.router.navigate(['/login']);
            this.alertifyService.dialogAlert(
              'Session expired. Please log in again.',
              'Timeout'
            );
            return of(false);
          })
        );
      }
    } else {
      // Token not found, redirect to login

      this.router.navigate(['/login']);
      return false;
    }
  }
}
