import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';
import { AlertifyService } from './alertify.service';
import { ChangePassDialogComponent } from '../components/administrator/change-pass-dialog/change-pass-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userProfiles?: CoreProfile[];
  private tokenRefreshed = false;
  private tokenRefreshedSubject = new Subject<boolean>();

  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private alertifyService: AlertifyService,
    private dialog: MatDialog
  ) {}

  authenticate(user: User) {
    this.dataService.validateUser(user).subscribe({
      next: (result) => {
        if (result.statusCode === 200) {
          const token = result.data.token;
          const profiles = result.data.profiles;
          const refreshToken = result.data.refreshToken;
          if (token && result.data.firstLogin === false) {
            this.storeTokens(token, refreshToken);
            this.router.navigate(['/profiles-main']);
            this.userProfiles = profiles;
          } else if (token && result.data.firstLogin === true) {
            this.openChangePasswordDialog();
          }
        } else if (result.statusCode === 423) {
          this.alertifyService.dialogAlert(result.message!);
        }
      },
      error: (err) => {
        let errorMessage = 'An error occurred';
        if (err.status === 401) {
          errorMessage = 'Incorrect username or password';
        } else if (err.status === 500) {
          errorMessage = 'An error occurred. Please try again later.';
        }

        this.alertifyService.error(errorMessage);
      },
    });
  }

  private storeTokens(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  refreshTokens() {
    if (this.tokenRefreshed) {
      return; // Prevent multiple refresh attempts
    }

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logout();
      return;
    }

    this.tokenRefreshed = true;

    this.dataService.refreshToken(refreshToken).subscribe({
      next: (result) => {
        const token = result.token;
        const newRefreshToken = result.refreshToken;
        this.storeTokens(token, newRefreshToken);
        this.tokenRefreshed = false; // Reset the flag after successful token refresh
        this.tokenRefreshedSubject.next(true);
      },
      error: (err) => {
        if (err.status == 403) {
          this.router.navigate(['/login']);
        } else {
          this.logout();
        }
      },
    });
  }
  onTokenRefreshed(): Observable<any> {
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
        this.alertifyService.dialogAlert(response.message!);
        localStorage.clear();
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
      },
    });
  }
}
