import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-email-button',
  templateUrl: './send-email-button.component.html',
  styleUrls: ['./send-email-button.component.css'],
})
export class SendEmailButtonComponent {
  constructor(private router: Router) {}
  navigateToComponent() {
    const componentRoute = '/sendEmail';

    this.router.navigateByUrl(componentRoute);
  }
}
