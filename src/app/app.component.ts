import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingServiceService } from './services/loading-service.service';
import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UsersIdleService } from './services/users-idle.service';
import { DicoServiceService } from './services/dico-service.service';
import { DateFormatterService } from './services/date-formatter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tutorial';
  imgUrl = 'https://picsum.photos/id/237/200/300';
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  dateFormats?: any;
  dico?: any;
  private idleServiceInitialized = false;
  theme: any;
  constructor(
    private authService: AuthService,
    private userIdlesService: UsersIdleService,
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService,
    private themeService: LoadingServiceService
  ) {}
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.userIdlesService.initializeIdleService();
    }
    // this.theme = this.themeService.getTheme();
  }
  // changeTheme() {
  //   this.themeService.updateTheme({ colorSchemeColor: '#000000' });
  //   this.theme = this.themeService.getTheme();
  // }
  // changeTheme(themeName: string): void {
  //   this.themeService.changeTheme(themeName);
  //   this.updateThemeOnDOM(themeName);
  // }

  // private updateThemeOnDOM(themeName: string): void {
  //   const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
  //   if (themeLink) {
  //     themeLink.href = `node_modules/primeng/resources/themes/${themeName}/theme.css`;
  //   }
  // }
  // ngOnDestroy(): void {
  //   // Clear local storage data when the AppComponent is destroyed (i.e., on logout).
  //   if (!this.authService.isAuthenticated()) {
  //     localStorage.removeItem('timeout');
  //   }
  // }
  dateFormatterService() {
    // this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  changeImage(e: KeyboardEvent) {
    this.imgUrl = (e.target as HTMLInputElement).value;
  }

  logImg(event: string) {
    console.log(event);
  }
}
