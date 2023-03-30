import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/shared/data-service.service';

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
  userName?: string = '';
  password?: string = '';
  subscription?: Subscription;
  message?: string;
  defaultLang?: string = 'en';
  constructor(
    private authService: AuthService,
    private dataService: DataServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.getLanguages();
  }

  ngOnInit(): void {
    this.authenticateUser();
    this.Dico(this.defaultLang!);
    this.clearData();
  }

  authenticateUser() {
    this.subscription = this.authService.authenticationResultEvent.subscribe(
      (result) => {
        if (result) {
          // alert('here' + JSON.stringify(result));
          // const url = this.activatedRoute.snapshot.queryParams['redirect'];
          // this.authService.isAuthenticated = true;
          // if (url == null) {
          //   this.route.navigateByUrl('profiles-main');
          // } else {
          //   this.route.navigateByUrl(url);
          // }
          console.log(result);
        } else {
          this.message =
            'Your username or password was not recognised - try again.';
        }
      },
      (error: any) => {
        this.message =
          'Your username or password was not recognised - try again.';
      }
    );
  }

  login() {
    if (this.userName && this.password) {
      this.authService.authenticate(this.userName, this.password);
    } else {
      return;
    }
  }
  clearData() {
    localStorage.clear();
  }
  getLanguages() {
    this.dataService.getLanguages().subscribe({
      next: (res) => {
        // console.log(res);
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
}
