import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

interface language {
  key: string;
  value: string;
}
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  languages?: language[];
  selectedLanguage: string = 'en';
  userName: string = '';
  password: string = '';
  subscription?: Subscription;
  // message?: string;
  defaultLang: string = 'en';
  private userIdleSub?: Subscription;

  constructor(
    private authService: AuthService,
    private dataService: DataServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private loginDataService: LoadingServiceService,
    private userIdlesService: UsersIdleService,
    private dicoService: DicoServiceService,
    private userRoles: UsersRolesService
  ) {}

  ngOnInit(): void {
    this.clearData();
    this.getLanguages();
    // this.Dico(this.selectedLanguage!)
    this.getDico();
    this.loginDataService.clearLoginInfo();
    this.userIdlesService.stopWatching();
    this.userRoles.clearRoles();
  }

  getDico() {
    this.dicoService.getDico();
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
  }
  ngOnDestroy() {
    this.userIdlesService.ngOnDestroy();
  }
  login() {
    const lang = localStorage.getItem('selectedLanguage');
    const user = {
      username: this.userName!,
      password: this.password!,
    };
    if (this.userName && this.password && this.languages && lang) {
      this.authService.authenticate(user);
      // this.userIdlesService.initializeIdleService();
      // this.userIdlesService.startWatching();
    } else {
      this.alertify.error('Please enter your username and password');
      // return;
    }
  }

  getLanguages() {
    this.dataService.getLanguages().subscribe({
      next: (res) => {
        this.languages = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  languageChanged() {
    localStorage.setItem('selectedLanguage', this.selectedLanguage!);
    this.dicoService.getDico();
  }
  Dico(lang: string) {
    this.dataService.multiLang(lang).subscribe({
      next: (res) => {
        this.selectedLanguage = lang;

        // this.dicoService.getDico(); // Call getDico() to update language data
        // console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  clearData() {
    localStorage.clear();
  }
}
