import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarCover } from 'src/app/model/car-cover';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarCoverComponent } from '../add-car-cover/add-car-cover.component';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-cars-cover',
  templateUrl: './cars-cover.component.html',
  styleUrls: ['./cars-cover.component.css'],
})
export class CarsCoverComponent implements OnInit {
  companies?: CompanyBranchList[];
  company?: string;
  carCover?: CarCover[];
  code: string = '';
  description: string = '';
  coverTypes?: type[];
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.getCoverTypes();
  }

  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        // console.log(this.companies);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCoverTypes() {
    this.dataService.getCoverTypes().subscribe({
      next: (res) => {
        this.coverTypes = res.data;
        // console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // findCarCoverListByInsuranceId() {
  //   this.dataService.findCarCoverListByInsuranceId(this.company!).subscribe({
  //     next: (res) => {
  //       this.carCover = res.data;
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  searchCarCover() {
    this.dataService
      .searchCarCover(this.company!, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.carCover = res.data;
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteCarCover(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarCover(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  openAddCoverDialog() {
    this.dialog.open(AddCarCoverComponent, {
      data: {
        types: this.coverTypes,
        insuranceId: this.company,
      },
    });
  }
}
