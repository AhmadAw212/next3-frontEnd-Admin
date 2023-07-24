import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreProfile } from 'src/app/model/core-profile';
// import { AuthService } from 'src/app/shared/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { Subscription } from 'rxjs';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-profiles-page',
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.css'],
})
export class ProfilesPageComponent implements OnInit {
  userProfiles?: CoreProfile[];
  selectedProfile?: CoreProfile;
  dico?: any;
  subscription?: Subscription;
  payload?: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private userRoles: UsersRolesService
  ) {}

  ngOnInit(): void {
    this.getUserProfiles();
    this.getDico();
    localStorage.removeItem('selectedProfile');
    this.userRoles.clearRoles();
  }
  redirectToProfile(profile: CoreProfile): void {
    const description = profile.description;

    if (description === 'Administrator' || description === 'CallCenter') {
      localStorage.setItem('selectedProfile', profile.id!);
      this.router.navigate([`/${description}`]);
    } else {
      // Handle other profile descriptions or show an error message.
      console.error('Unknown profile description:', description);
    }
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
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
              profile.name === 'Admin' || profile.name === 'cc'
          );
        console.log(this.userProfiles);
      },
      error: (err) => {
        if (err.status === 401) {
          // this.authService.refreshTokens();
          // this.authService.logout();
          // this.alertifyService.dialogAlert('Error');
        } else {
          this.alertifyService.dialogAlert(err.error.message);
        }
      },
    });
  }
}
