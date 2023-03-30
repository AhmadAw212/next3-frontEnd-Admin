import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated?: boolean;
  login_user?: string;
  authenticationResultEvent = new EventEmitter<boolean>();
  userProfiles?: CoreProfile[];
  constructor(
    private dataService: DataServiceService,
    private router: Router
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
          // console.log(this.userProfiles?.map((res) => res.description));
          // this.isAuthenticated = true;
          // this.authenticationResultEvent.emit(true);
          // this.userProfilesSubject = profiles;
          // console.log(profiles);
        }
      },
      error: (err) => {
        // this.isAuthenticated = false;
        // this.authenticationResultEvent.emit(false);
        this.router.navigate(['/login']);
        console.log(err);
      },
    });
  }
}
