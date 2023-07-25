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
  constructor(
    private authService: AuthService,
    private userIdlesService: UsersIdleService,
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService
  ) {}
  ngOnInit(): void {
    // this.getDico();
    // this.dateFormatterService();
    if (this.authService.isAuthenticated()) {
      this.userIdlesService.initializeIdleService();
    }
  }
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
