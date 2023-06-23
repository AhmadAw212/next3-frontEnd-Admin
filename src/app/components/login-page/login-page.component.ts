import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

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
  selectedLanguage?: string;
  userName: string = '';
  password: string = '';
  subscription?: Subscription;
  // message?: string;
  defaultLang: string = 'en';
  constructor(
    private authService: AuthService,
    private dataService: DataServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.clearData();
    this.getLanguages();
    this.Dico(this.defaultLang!);
  }

  login() {
    const lang = localStorage.getItem('selectedLanguage');
    const user = {
      username: this.userName!,
      password: this.password!,
    };
    if (this.userName && this.password && this.languages && lang) {
      this.authService.authenticate(user);
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

  Dico(lang: string) {
    this.dataService.multiLang(lang).subscribe({
      next: (res) => {
        this.selectedLanguage = lang;
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
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
