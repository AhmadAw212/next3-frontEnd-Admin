import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { type } from 'src/app/model/type';

@Component({
  selector: 'app-claim-label-report',
  templateUrl: './claim-label-report.component.html',
  styleUrls: ['./claim-label-report.component.css'],
})
export class ClaimLabelReportComponent implements OnInit {
  dico?: any;
  company: string = '';
  companies?: any[] = [];
  statusValues: type[] = [];
  orderValues: type[] = [];
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
    this.getCompaniesPerUser();
    this.getStatusValues();
    this.getOrderValues();
  }
  getStatusValues(): type[] {
    const result: type[] = [];
    result.push({ code: '', description: '' });
    result.push({ code: 'OPENED', description: 'Opened' });
    result.push({ code: 'Closed', description: 'Closed' });
    this.statusValues = result;
    return result;
  }
  getOrderValues(): type[] {
    const result: type[] = [];
    result.push({ code: '', description: '' });
    result.push({ code: 'SERIAL', description: 'Serial' });
    result.push({ code: 'CLAIMNUMBER', description: 'Claim Number' });
    this.orderValues = result;
    return result;
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        this.companies?.push({
          companyId: 'ALL',
          companyName: 'ALL',
        });
        // console.log(this.companies);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
