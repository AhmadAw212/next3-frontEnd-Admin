import { Component, Input, OnInit } from '@angular/core';
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
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
  // dico?: any;
  logo?: string;
  userPic!: string;
  @Input() dico?: any;

  private loginInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public loginInfo$: Observable<any> = this.loginInfoSubject.asObservable();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService
  ) {}
  ngOnInit(): void {
    this.loadLoginData();
    this.dateFormatterService();
    this.getDico();
  }
  private loadLoginData() {
    const storedLoginData = this.loginDataService.getLoginInfo();
    if (storedLoginData) {
      this.setLoginInfo(storedLoginData);
    } else {
      this.fetchLoginInfoFromServer();
    }
  }

  private fetchLoginInfoFromServer() {
    this.dataService.loginUserInfo().subscribe({
      next: (data) => {
        this.loginDataService.setLoginInfo(data.data);
        this.setLoginInfo(data.data);
        // ... other response handling code
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
    });
  }
  private setLoginInfo(loginInfo: LoginInfo) {
    this.loginInfo = loginInfo;
    this.logo = `data:image/jpeg;base64,${this.loginInfo?.logo}`;
    this.userPic = `data:image/jpeg;base64,${this.loginInfo?.userPicture}`;
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
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
    //
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
        this.logo = `data:image/jpeg;base64,${this.loginInfo?.logo}`;
        this.userPic = `data:image/jpeg;base64,${this.loginInfo?.userPicture}`;
        this.loginInfoSubject.next(data);
        // console.log(data.data);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
    });
  }
}
