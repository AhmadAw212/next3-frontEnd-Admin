import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-entry-button',
  templateUrl: './data-entry-button.component.html',
  styleUrls: ['./data-entry-button.component.css'],
})
export class DataEntryButtonComponent {
  @Input() buttonText: string = 'Data Entry';
  @Input() notificationId: string | undefined;
  constructor(private router: Router) {}

  navigateToDataEntry() {
    if (this.notificationId) {
      const componentRoute = `dataEntryView/${this.notificationId}`;
      this.router.navigateByUrl(componentRoute);
    }
  }
}
