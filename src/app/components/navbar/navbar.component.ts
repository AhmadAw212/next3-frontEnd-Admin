import { Component, Input } from '@angular/core';
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
  // @Input() viewPolicy: boolean = true;
  @Input() note: boolean = false;
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/profiles-main']);
  }
}
