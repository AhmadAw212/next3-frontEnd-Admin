import { Component, Input } from '@angular/core';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-bodily-injury',
  templateUrl: './bodily-injury.component.html',
  styleUrls: ['./bodily-injury.component.css'],
})
export class BodilyInjuryComponent {
  @Input() dico?: any;
  @Input() Injured!: any;

  constructor(
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService
  ) {}
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  ngOnInit(): void {
    // this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
