import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
import { AlertifyService } from '../services/alertify.service';
import { TokenPayload } from '../model/token-payload';
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
    const payload = jwt_decode(token!) as TokenPayload;
    const expiredDate = payload.exp < Date.now() / 1000;
   
    if (!token || expiredDate) {
      this.alertifyService.dialogAlert('Session Expired');
      this.authService.logout();
      return false;
    }

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
