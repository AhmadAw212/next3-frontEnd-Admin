import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bodily-injury',
  templateUrl: './bodily-injury.component.html',
  styleUrls: ['./bodily-injury.component.css'],
})
export class BodilyInjuryComponent {
  @Input() Injured!: any;

  constructor() {}
}
