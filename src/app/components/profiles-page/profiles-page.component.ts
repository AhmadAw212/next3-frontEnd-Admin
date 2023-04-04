import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoreProfile } from 'src/app/model/core-profile';
import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/shared/data-service.service';

import jwtDecode from 'jwt-decode';
import { TokenPayload } from 'src/app/model/token-payload';
@Component({
  selector: 'app-profiles-page',
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.css'],
})
export class ProfilesPageComponent implements OnInit {
  userProfiles?: CoreProfile[];
  selectedProfile?: CoreProfile;
  // subscription?: Subscription;
  payload?: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataServiceService
  ) {}

  ngOnInit(): void {
    this.getUserProfiles();
    localStorage.removeItem('selectedProfile');
  }
  redirectToProfile(profile: CoreProfile) {
    if (profile.description === 'Administrator') {
      localStorage.setItem('selectedProfile', profile.id!);
      this.router.navigate(['Administrator']);
    } else {
      this.router.navigate(['/profiles-main', profile.description]);
    }
  }

  getUserProfiles() {
    this.dataService.getUserListProfiles().subscribe({
      next: (profiles) => {
        this.userProfiles = profiles.data;
      },
      error: (error) => {
        if (error.error === 'Token Expired') {
          this.authService.logout();
          console.log(error.error);
        }
      },
    });
  }
}
