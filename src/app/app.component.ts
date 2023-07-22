import { Component, OnInit } from '@angular/core';
import { LoadingServiceService } from './services/loading-service.service';
import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UsersIdleService } from './services/users-idle.service';

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

  constructor(
    private authService: AuthService,
    private userIdlesService: UsersIdleService
  ) {}
  ngOnInit(): void {
    this.userIdlesService.initializeIdleService();
  }

  changeImage(e: KeyboardEvent) {
    this.imgUrl = (e.target as HTMLInputElement).value;
  }

  logImg(event: string) {
    console.log(event);
  }
}
