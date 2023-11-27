import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],
})
export class BackButtonComponent {
  constructor(private router: Router, private location: Location) {}
  @Input() targetRoute?: string;
  @Input() showBackBtn: boolean = false;
  back(): void {
    this.location.back();
  }
}
