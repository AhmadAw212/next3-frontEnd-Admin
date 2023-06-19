import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreProfile } from 'src/app/model/core-profile';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
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
    private dataService: DataServiceService,
    private alertifyService: AlertifyService
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
        // this.userProfiles = profiles.data;
        this.userProfiles = profiles.data
          .map((profile: CoreProfile) => {
            // console.log(`data:image/jpeg;base64,${profile.logo}`);
            return {
              ...profile,
              logo: `data:image/jpeg;base64,${profile.logo}`,
            };
          })
          .filter(
            (profile: CoreProfile) =>
              profile.description === 'Administrator' ||
              profile.description === 'Administrator'
          );
        console.log(this.userProfiles);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
}
