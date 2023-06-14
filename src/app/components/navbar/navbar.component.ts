import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() title?: string;
  @Input() showDataEntryButton?: boolean = true;
  @Input() sendEmailButton?: boolean = true;
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/Administrator']);
  }
}
