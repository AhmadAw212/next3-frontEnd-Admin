import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-hotline-btn',
  templateUrl: './new-hotline-btn.component.html',
  styleUrls: ['./new-hotline-btn.component.css'],
})
export class NewHotlineBtnComponent {
  @Input() buttonText: string = 'Default Text';
  @Input() notificationId: string | undefined;

  constructor(private router: Router) {}

  navigateToHotline() {
    if (this.notificationId) {
      const componentRoute = `hotline/${this.notificationId}`;
      this.router.navigateByUrl(componentRoute);
    }
  }
}
