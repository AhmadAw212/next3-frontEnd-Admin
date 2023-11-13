import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';
import { AlertifyService } from './alertify.service';
import { ChangePassDialogComponent } from '../components/administrator/change-pass-dialog/change-pass-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  map,
  tap,
  throwError,
} from 'rxjs';
import { LoadingServiceService } from './loading-service.service';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getAccessToken() {
    throw new Error('Method not implemented.');
  }
  refreshToken() {
    throw new Error('Method not implemented.');
  }
  setAccessToken(token: any) {
    throw new Error('Method not implemented.');
  }
  userProfiles?: CoreProfile[];
  private tokenRefreshed = false;
  private tokenRefreshedSubject = new Subject<boolean>();

  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private alertifyService: AlertifyService,
    private dialog: MatDialog,
    private loadingService: LoadingServiceService
  ) {}

  authenticate(user: User) {
    this.dataService.validateUser(user).subscribe({
      next: (result) => {
        if (result.statusCode === 200) {
          const token = result.data.token;
          const profiles = result.data.profiles;
          const timeout = result.data.timeout_value;
          const refreshToken = result.data.refreshToken;
          if (token && result.data.firstLogin === false) {
            this.storeTokens(token, refreshToken);
            localStorage.setItem('timeout', timeout);
            this.router.navigate(['/profiles-main']);
            this.userProfiles = profiles;
          } else if (result.data.firstLogin === true) {
            this.storeTokens(token, refreshToken);
            localStorage.setItem('timeout', timeout);
            this.openChangePasswordDialog();
          }
        } else if (result.statusCode === 423) {
          this.alertifyService.error(result.message);
        }
      },
      error: (err) => {
        console.log(err);
        // let errorMessage = 'An error occurred';
        // if (err.error.status === 401) {
        //   errorMessage = 'Incorrect username or password';
        //   // Send the error message here
        //   this.alertifyService.error(errorMessage);
        // } else if (err.error.status === 500) {
        //   errorMessage = 'Incorrect username or password ';
        //   // errorMessage = 'An error occurred. Please try again later.';
        //   // Send the error message here
        //   this.alertifyService.error(errorMessage);
        // } else if (err.error.status === 404) {
        //   this.alertifyService.error(err.error.message);
        // }
      },
    });
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Return true if the token exists, otherwise false
  }
  private storeTokens(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('selectedProfile');
  }
  refreshTokens(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logout();
      // console.log('Refresh token not found');
      return throwError(() => 'Refresh token not found');
    }

    if (this.tokenRefreshed) {
      // Token already refreshed, emit the token refreshed subject
      this.tokenRefreshedSubject.next(true);
      return EMPTY;
    }

    this.tokenRefreshed = true;

    return this.dataService.refreshToken(refreshToken).pipe(
      tap((result: any) => {
        const token = result.token;
        const newRefreshToken = result.refreshToken;
        this.storeTokens(token, newRefreshToken);
        this.tokenRefreshedSubject.next(true);
      }),
      catchError((error: any) => {
        // this.logout();
        // this.alertifyService.error(error.error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.tokenRefreshed = false; // Reset the token refreshed flag
      })
    );
  }
  onTokenRefreshed(): Observable<boolean> {
    return this.tokenRefreshedSubject.asObservable();
  }
  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePassDialogComponent, {
      width: '300px',
      // Add any additional configuration for the dialog
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // Handle any logic after the change password dialog is closed
      if (result) {
        this.router.navigate(['/profiles-main']);
      }
    });
  }
  logout() {
    this.dataService.logout().subscribe({
      next: (response) => {
        this.alertifyService.dialogAlert(response.message!, response.title);
        this.clearTokens();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Session Timeout', 'Timeout');
      },
    });
  }
}
