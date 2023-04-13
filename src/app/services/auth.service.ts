import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';
import { AlertifyService } from './alertify.service';
import { ApiResponse } from '../model/api-response';
// import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // isAuthenticated?: boolean;
  // login_user?: string;
  // authenticationResultEvent = new EventEmitter<boolean>();
  userProfiles?: CoreProfile[];
  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  authenticate(name: string, password: string) {
    this.dataService.validateUser(name, password).subscribe({
      next: (result) => {
        const token = result.data.token;
        const profiles = result.data.profiles;
        
        localStorage.setItem('token', token);

        if (token) {
          this.router.navigate(['/profiles-main']);
          this.userProfiles = profiles;
          console.log(result.data);
          // console.log(this.userProfiles?.map((res) => res.description));
          // this.isAuthenticated = true;
          // this.authenticationResultEvent.emit(true);
          // this.userProfilesSubject = profiles;
          // console.log(profiles);
        }
      },
      error: (err) => {
        let errorMessage = 'An error occurred';
        if (err.status === 401) {
          errorMessage = 'Incorrect username or password';
        } else if (err.status === 500) {
          errorMessage = 'An error occurred. Please try again later.';
        }
        this.alertifyService.error(errorMessage);
        // this.isAuthenticated = false;
        // this.authenticationResultEvent.emit(false);
        // this.router.navigate(['/login']);
        // console.log(err.error.message);
      },
    });
  }

  logout(): void {
    localStorage.clear();
    this.alertifyService.dialogAlert('Session Expired');
    this.router.navigate(['/login']);
  }
}
