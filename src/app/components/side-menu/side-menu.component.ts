import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  toggleMenu() {
    this.sidenav.toggle();
  }
}
