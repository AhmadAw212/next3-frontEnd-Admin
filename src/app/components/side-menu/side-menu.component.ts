import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  searchIcon = faSearch;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  toggleMenu() {
    this.sidenav.toggle();
  }
}
