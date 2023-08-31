import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-entry-button',
  templateUrl: './data-entry-button.component.html',
  styleUrls: ['./data-entry-button.component.css'],
})
export class DataEntryButtonComponent {
  constructor(private router: Router) {}
}
