import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userProfiles?: CoreProfile[];
  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  authenticate(name: string, password: string) {
    this.dataService.validateUser(name, password).subscribe({
      next: (result) => {
        if (result.statusCode === 200) {
          const token = result.data.token;
          const profiles = result.data.profiles;
          localStorage.setItem('token', token);
          if (token) {
            this.router.navigate(['/profiles-main']);
            this.userProfiles = profiles;
          }
        } else if (result.statusCode === 423)
          this.alertifyService.dialogAlert(result.message!);
        // console.log(result.message);
      },
      error: (err) => {
        let errorMessage = 'An error occurred';
        if (err.status === 401) {
          errorMessage = 'Incorrect username or password';
        } else if (err.status === 500) {
          errorMessage = 'An error occurred. Please try again later.';
        }

        this.alertifyService.error(errorMessage);
      },
    });
  }

  logout(): void {
    localStorage.clear();
    this.alertifyService.dialogAlert('Session Expired');
    this.router.navigate(['/login']);
  }
}
