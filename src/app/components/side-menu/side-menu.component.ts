import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private userRolesService: UsersRolesService,
    private dicoService: DicoServiceService
  ) {}
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }
  searchIcon = faSearch;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @Input() dico?: any;
  isLoading: boolean = false;
  toggleMenu() {
    this.sidenav.toggle();
  }
  ngOnInit(): void {
    this.getDico();
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
  // getDico() {
  //   const language = localStorage.getItem('selectedLanguage')!;
  //   this.dataService.Dico(language).subscribe({
  //     next: (language) => {
  //       this.dico = language.data;
  //       // console.log(language);
  //     },
  //     error: (err) => {
  //       if (err.status === 401 || err.status === 500) {
  //         // this.authService.logout();
  //         this.alertifyService.dialogAlert('Error');
  //       }
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     },
  //   });
  // }
}
