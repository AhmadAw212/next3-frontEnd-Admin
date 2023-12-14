import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreProfile } from 'src/app/model/core-profile';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-profiles-nav',
  templateUrl: './profiles-nav.component.html',
  styleUrls: ['./profiles-nav.component.css'],
})
export class ProfilesNavComponent {
  links = [];
  titles = [];
  activeLink: any = this.links[0];
  background = '';
  userProfiles: any[] = [];
  showDropdown: boolean = false;
  constructor(private dataService: DataServiceService) {
    this.getUserProfiles();
  }

  getUserProfiles() {
    this.dataService.getUserListProfiles().subscribe({
      next: (profiles) => {
        // this.userProfiles = profiles.data;
        this.activeLink = profiles.data.code;
        this.userProfiles = profiles.data
          .map((profile: CoreProfile) => {
            // console.log(`data:image/jpeg;base64,${profile.logo}`);
            return {
              ...profile,
              logo: `data:image/jpeg;base64,${profile.logo}`,
            };
          })
          .filter((profile: CoreProfile) => profile.code === 'adm');
        console.log(this.userProfiles);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  navigateToProfile(profile: CoreProfile) {
    this.activeLink = this.profileLink(profile);
    delete profile.logo;
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
  }

  profileLink(profile: CoreProfile): string {
    return `/profiles-main/${profile.description}/`;
  }
}
