import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, catchError } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
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

    if (!token) {
      this.alertifyService.dialogAlert('Session Expired');
      this.authService.logout();
      return false;
    }

    const payload = this.decodeToken(token);
    const expiredDate = payload.exp < Date.now() / 1000;

    if (expiredDate) {
      this.router.navigate(['/login']); // Navigate user to the login page
      this.alertifyService.dialogAlert('Session Expired');
      return false;
    } else {
      // Token is not expired, call the refresh token function
      return this.authService.refreshTokens().pipe(
        map((refreshedToken) => {
          if (refreshedToken) {
            localStorage.setItem('token', refreshedToken);
            return this.checkAccess(route, payload);
          } else {
            this.alertifyService.dialogAlert('Session Expired');
            throw new Error('Token refresh failed');
          }
        }),
        catchError((error) => {
          this.authService.logout();
          throw new Error('Token refresh failed');
        })
      );
    }
  }

  private decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      this.authService.logout();
      throw new Error('Invalid token');
    }
  }

  private checkAccess(route: ActivatedRouteSnapshot, payload: any): boolean {
    const authorities = payload.authorities;
    const requiredAuthorities = route.data?.['authorities'];

    if (
      requiredAuthorities &&
      !requiredAuthorities.every((authority: string) =>
        authorities.includes(authority)
      )
    ) {
      this.router.navigate(['/profiles-main']);
      return false;
    }

    return true;
  }
}
