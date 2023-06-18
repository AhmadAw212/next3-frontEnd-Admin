import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private userRolesService: UsersRolesService
  ) {}
  searchIcon = faSearch;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  dico?: any;
  toggleMenu() {
    this.sidenav.toggle();
  }
  ngOnInit(): void {
    this.getDico();
    this.userRolesService.getUserRoles();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  getDico() {
    const language = localStorage.getItem('selectedLanguage')!;
    this.dataService.Dico(language).subscribe({
      next: (language) => {
        this.dico = language.data;
        // console.log(language);
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
