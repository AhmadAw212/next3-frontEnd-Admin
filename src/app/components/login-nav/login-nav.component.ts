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
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-login-nav',
  templateUrl: './login-nav.component.html',
  styleUrls: ['./login-nav.component.css'],
})
export class LoginNavComponent implements OnInit {
  userName?: string;
  loginInfo?: LoginInfo;
  reportDateTimeFormat?: string;
  dateFormats?: any;
  dico?: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
    this.loginUserInfo();

    this.dateFormatterService();
    this.getDico();
  }
  dateFormatterService() {
    this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
    this.dicoService.getDico();
  }

  logout(): void {
    this.dataService.logout().subscribe({
      next: (response) => {
        this.alertifyService.dialogAlert(response.message!);
        localStorage.clear();
        this.router.navigate(['/login']);
        // console.log(response);
      },
      error: (err) => {
        if (err.status === 401) {
         // this.authService.refreshTokens();
          // this.authService.logout();
           this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePassDialogComponent, {
      width: '300px',
    });
  }

  loginUserInfo() {
    this.dataService.loginUserInfo().subscribe({
      next: (data) => {
        this.loginInfo = data.data;
        // console.log(data.data);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
    });
  }
}
