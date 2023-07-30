import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.css'],
})
export class AppContentComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  toggleMenu() {
    this.sidenav.toggle();
  }
}
