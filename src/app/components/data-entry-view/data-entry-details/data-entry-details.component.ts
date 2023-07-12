import { Component, Input, OnInit } from '@angular/core';
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

  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  constructor(private dicoService: DicoServiceService) {}
}
