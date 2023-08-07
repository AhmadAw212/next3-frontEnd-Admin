import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarExpert } from 'src/app/model/car-expert';
import { CarSupplier } from 'src/app/model/car-supplier';
import { type } from 'src/app/model/type';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddExpertComponent } from '../add-dialogs/add-expert/add-expert.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AlertifyService } from 'src/app/services/alertify.service';
@Component({
  selector: 'app-expert-config',
  templateUrl: './expert-config.component.html',
  styleUrls: ['./expert-config.component.css'],
})
export class ExpertConfigComponent implements OnInit {
  companies?: any[];
  expertSupplier?: CarSupplier[] = [];
  domainYN?: type[];
  expGroup?: type[];
  terrAddress?: type[];
  insuranceId!: string;
  selectedValue?: string;
  selectedSupplier!: CarSupplier;
  bodilyInjury: string = 'ALL';
  vipCode: string = 'ALL';
  // territory: string = '';
  group: string = 'X';
  exclusiveCode: string = 'ALL';
  territoryCode: string = '';
  fullName?: string;
  fatherName?: string;
  prefixFamily?: string;
  familyName?: string;
  arabicName?: string;
  mobilePhone?: string;
  sms?: boolean;
  expertSearchResult?: CarExpert[];
  showExpertResult: boolean = true;
  private searchTimer: any;
  isLoading: boolean = false;
  dico?: any;
  dateFormats?: any;
  constructor(
    private dataService: DataServiceService,
    private dicoService: DicoServiceService,
    private dateFormatService: DateFormatterService,
    private datePipe: DatePipe,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    // this.getSupplierExpert();
    this.getDomainYN();
    this.getExpGroup();
    this.getDico();
  }

  getDico() {
    // this.isLoading = true;
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  // onSearch(searchTerm: any): void {
  //   console.log('Search term:', searchTerm.term);

  // }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  // showExpResult() {
  //   this.showExpertResult = true;
  // }
  onSupplierChange(): void {
    // console.log('Selected supplier:', this.selectedSupplier);
    this.fullName = this.selectedSupplier.fullName;
    this.fatherName = this.selectedSupplier.fathersName;
    this.prefixFamily = this.selectedSupplier.prefixFam;
    this.familyName = this.selectedSupplier.lastname;
    this.arabicName = this.selectedSupplier.arabic_name;
    this.mobilePhone = this.selectedSupplier.mobile_number;
    this.sms = this.selectedSupplier.sms;
  }

  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.insuranceId = this.companies![0].companyId;
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }

  getSupplierExpert() {
    this.dataService.searchSupplierExpert().subscribe({
      next: (res) => {
        this.expertSupplier = res.data;
        console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }

  getDomainYN() {
    this.dataService.getDomainYN().subscribe({
      next: (res) => {
        this.domainYN = res.data;
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }

  getExpGroup() {
    this.dataService.getExpGroup().subscribe({
      next: (res) => {
        this.expGroup = res.data;
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }
  searchSupplierByName(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const name = event.term;
      const company = this.insuranceId!;
      this.dataService.searchSupplierByName(name).subscribe({
        next: (res) => {
          this.expertSupplier = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
    }, 300);
  }

  territoryAddress(event: any) {
    const territoryName = event.term;

    this.dataService.territoryAddress(territoryName).subscribe({
      next: (res) => {
        this.terrAddress = res.data;
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }

  expertSearch() {
    this.showExpertResult = true;

    const supplierId = this.selectedSupplier.id;
    const insurance_id = this.insuranceId!;
    const groupCode = this.group!;
    const bodilyInjuriesCode = this.bodilyInjury!;
    const exclusiveCode = this.exclusiveCode!;
    const vip = this.vipCode!;
    const territory = this.territoryCode === null ? '' : this.territoryCode;

    this.dataService
      .searchExpert(
        supplierId,
        insurance_id,
        groupCode,
        bodilyInjuriesCode,
        exclusiveCode,
        vip,
        territory
      )
      .subscribe({
        next: (res) => {
          this.expertSearchResult = res.data;
          console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
  }
}
