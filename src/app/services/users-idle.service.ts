import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, fromEvent, throttleTime } from 'rxjs';
import { AuthService } from './auth.service';
import {
  UserIdleService as NgxUserIdleService,
  provideUserIdleConfig,
} from 'angular-user-idle';
import { DataServiceService } from './data-service.service';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UsersIdleService {
  private idleSub: Subscription | undefined;
  constructor(
    private userIdle: NgxUserIdleService,
    private authService: AuthService,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {}

  initializeIdleService(): void {
    this.configureUserIdle();
    this.userIdle.startWatching();
    // Start watching for user inactivity.

    // Add event listeners for user activity (e.g., mousemove and click events).
    fromEvent(document, 'mousemove')
      .pipe(throttleTime(1000))
      .subscribe(() => this.restart());
    fromEvent(document, 'click')
      .pipe(throttleTime(1000))
      .subscribe(() => this.restart());

    // Start watching when user idle is starting.
    this.idleSub = this.userIdle.onTimerStart().subscribe();

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe({
      next: () => {
        this.stop();
        this.logout();
      },
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from the onTimerStart subscription when the service is destroyed.
    if (this.idleSub) {
      this.idleSub.unsubscribe();
    }
  }
  configureUserIdle() {
    this.userIdle.stopWatching();
    let timeout = localStorage.getItem('timeout');
    const idleTimeout = timeout ? parseInt(timeout, 10) * 60 : 0;

    // console.log(idleTimeout);
    this.userIdle.setConfigValues({
      idle: idleTimeout,
      timeout: 5,
      ping: 60,
    });
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  logout() {
    this.dataService.logout().subscribe({
      next: (response) => {
        this.alertifyService.dialogAlert('Session Timeout');
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.alertifyService.dialogAlert(err.error.message);
      },
    });
  }
}
