import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePassDialogComponent } from '../administrator/change-pass-dialog/change-pass-dialog.component';
// import { AuthService } from 'src/app/shared/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { LoginInfo } from 'src/app/model/login-info';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

@Component({
  selector: 'app-login-nav',
  templateUrl: './login-nav.component.html',
  styleUrls: ['./login-nav.component.css'],
})
export class LoginNavComponent implements OnInit {
  userName?: string;
  loginInfo?: LoginInfo;
  reportDateTimeFormat?: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService
  ) {}
  ngOnInit(): void {
    this.loginUserInfo();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
      // this.reportDateTime = this.dateFormatService.reportDateTime;
    });
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
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
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
