import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePassDialogComponent } from '../change-pass-dialog/change-pass-dialog.component';
// import { AuthService } from 'src/app/shared/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { LoginInfo } from 'src/app/model/login-info';

@Component({
  selector: 'app-login-nav',
  templateUrl: './login-nav.component.html',
  styleUrls: ['./login-nav.component.css'],
})
export class LoginNavComponent {
  userName?: string;
  loginInfo?: LoginInfo;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dataService: DataServiceService
  ) {
    this.loginUserInfo();
  }

  logout(): void {
    this.dataService.logout().subscribe({
      next: (response) => {
        this.alertifyService.dialogAlert(response.message!);
        localStorage.clear();
        this.router.navigate(['/login']);
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePassDialogComponent, {
      width: '25%',
    });
  }

  loginUserInfo() {
    this.dataService.loginUserInfo().subscribe({
      next: (data) => {
        this.loginInfo = data.data;
        // console.log(data.data);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
}
