import { Component, Input, OnInit } from '@angular/core';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-data-entry-details',
  templateUrl: './data-entry-details.component.html',
  styleUrls: ['./data-entry-details.component.css'],
})
export class DataEntryDetailsComponent implements OnInit {
  @Input() lossCarList: any;
  @Input() dico?: any;

  ngOnInit(): void {
    // this.getDico();
  }
  getBase64Image(imageData: string): string {
    return 'data:image/jpeg;base64,' + imageData;
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  constructor(
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService
  ) {}
}
