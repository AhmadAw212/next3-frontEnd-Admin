import { Component, Input } from '@angular/core';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-bodily-injury',
  templateUrl: './bodily-injury.component.html',
  styleUrls: ['./bodily-injury.component.css'],
})
export class BodilyInjuryComponent {
  dico?: any;
  @Input() Injured!: any;

  constructor(private dicoService: DicoServiceService) {}


ngOnInit(): void {
  
  this.getDico();
}
getDico() {
  this.dicoService.getDico();
  this.dicoService.dico.subscribe((data) => {
    this.dico = data;
  });
}
}