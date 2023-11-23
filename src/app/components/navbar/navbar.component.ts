import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() title?: string;
  @Input() showDataEntryButton: boolean = false;
  @Input() sendEmailButton: boolean = false;
  @Input() targetRoute?: string;
  @Input() showBackBtn: boolean = false;
  navbarVisible: boolean = true;
  // @Input() viewPolicy: boolean = true;
  @Input() note: boolean = false;
  title2?: string;
  constructor(private router: Router, private location: Location) {
    // this.navbarService.getNavbarVisibility().subscribe((isVisible) => {
    //   this.navbarVisible = isVisible;
    // });
  }

  goBack(): void {
    this.router.navigate(['/profiles-main']);
  }

  // back(): void {
  //   this.location.back();
  // }
  back(): void {
    if (this.targetRoute) {
      this.router.navigate([this.targetRoute]);
    } else {
      this.router.navigate(['/']); // Fallback to the root route if no target route is specified.
    }
  }
}
