import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],
})
export class BackButtonComponent {
  constructor(private router: Router) {}
  @Input() targetRoute?: string;
  @Input() showBackBtn: boolean = false;
  goBack(): void {
    if (this.targetRoute) {
      this.router.navigate([this.targetRoute]);
    } else {
      this.router.navigate(['/']); // Fallback to the root route if no target route is specified.
    }
  }
}
