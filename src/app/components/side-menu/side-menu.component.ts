import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {
  @Input() showSurveyReq: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private userRolesService: UsersRolesService,
    private dicoService: DicoServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }
  searchIcon = faSearch;
  screenWidth?: number;
  profileId!: string;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @Input() dico?: any;
  isLoading: boolean = false;
  @Input() callCenter: boolean = false;

  isOpened: boolean = false;
  toggleMenu() {
    this.sidenav.toggle();
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.profileId = params['profileId'];
      // this.userRolesService.getUserRoles(this.profileId);
      // console.log(this.profileId);
    });
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {});
    this.getDico();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenav.opened) {
          this.isOpened = this.route.firstChild !== null;
          console.log(this.isOpened);
          this.sidenav.close();
        }
      });
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
