import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DatamgmtService } from '../services/datamgmt.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent {
  dico: any;
  constructor(
    private dataMgmtServive: DatamgmtService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService,
    private companyService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private route: ActivatedRoute,
    private dateFormatService: DateFormatterService,
    private sharedService: LoadingServiceService,
    private datePipe: DatePipe,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getDico();
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
