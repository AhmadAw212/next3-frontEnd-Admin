import { Component, OnInit } from '@angular/core';
import { CarSupplier } from 'src/app/model/car-supplier';
import { type } from 'src/app/model/type';
import { DataServiceService } from 'src/app/services/data-service.service';

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
  insuranceId?: string;
  selectedValue?: string;
  selectedSupplier!: CarSupplier;
  fullName?: string;
  fatherName?: string;
  prefixFamily?: string;
  familyName?: string;
  arabicName?: string;
  mobilePhone?: string;
  sms?: boolean;
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    // this.getSupplierExpert();
    this.getDomainYN();
    this.getExpGroup();
  }
  // onSearch(searchTerm: any): void {
  //   console.log('Search term:', searchTerm.term);

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
        console.log(err);
      },
    });
  }
  searchSupplierByName(event: any) {
    const name = event.term;
    const company = this.insuranceId!;
    this.dataService.searchSupplierByName(company, name).subscribe({
      next: (res) => {
        this.expertSupplier = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  territoryAddress(event: any) {
    const territoryName = event.term;
    this.dataService.territoryAddress(territoryName).subscribe({
      next: (res) => {
        this.terrAddress = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
