import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-material-damage',
  templateUrl: './material-damage.component.html',
  styleUrls: ['./material-damage.component.css'],
})
export class MaterialDamageComponent {
  @Input() matDamage: any;
}
