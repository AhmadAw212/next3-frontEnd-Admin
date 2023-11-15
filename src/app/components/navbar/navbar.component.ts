import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  // @Input() viewPolicy: boolean = true;
  @Input() note: boolean = false;
  title2?: string;
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/profiles-main']);
  }

  back(): void {
    if (this.targetRoute) {
      this.router.navigate([this.targetRoute]);
    } else {
      this.router.navigate(['/']); // Fallback to the root route if no target route is specified.
    }
  }
}
