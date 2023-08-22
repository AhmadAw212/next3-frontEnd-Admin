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
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
@Component({
  selector: 'app-profiles-page',
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.css'],
})
export class ProfilesPageComponent implements OnInit, OnDestroy {
  userProfiles?: CoreProfile[];
  selectedProfile?: CoreProfile;
  dico?: any;
  subscription?: Subscription;
  // private subscriptions: Subscription[] = [];
  payload?: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private userRoles: UsersRolesService,
    private userIdlesService: UsersIdleService,
    private profileService: LoadingServiceService
  ) {}
  ngOnDestroy(): void {
    // Unsubscribe from the subscription when the component is destroyed
    if (this.subscription) {
      this.userIdlesService.ngOnDestroy();
    }
  }
  // ngOnDestroy(): void {
  //   // Unsubscribe from all subscriptions to avoid memory leaks
  //   this.subscriptions.forEach((sub) => sub.unsubscribe());
  //   console.log(this.subscriptions.forEach((sub) => sub.unsubscribe()));
  // }
  ngOnInit(): void {
    this.getUserProfiles();
    this.getDico();
    // localStorage.removeItem('selectedProfile');
    this.userRoles.clearRoles();
    this.userIdlesService.initializeIdleService();
  }

  redirectToProfile(profile: CoreProfile): void {
    const description = profile.description;
    // const id = profile.id!;
    if (description) {
      delete profile?.logo;
      localStorage.setItem('selectedProfile', JSON.stringify(profile));
      // localStorage.setItem('selectedProfile', id);
      // localStorage.setItem('company', company!);
      this.router.navigate([`profiles-main`, description]); // Pass the profile id as a parameter
    } else {
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
              profile.code === 'adm' || profile.code === 'cc'
          );
        console.log(this.userProfiles);
      },
      error: (err) => {
        this.alertifyService.dialogAlert(err.error.message);
      },
    });
  }
}
