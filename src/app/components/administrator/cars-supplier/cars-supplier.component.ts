import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarSupplier } from 'src/app/model/car-supplier';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarSupplierComponent } from '../add-dialogs/add-car-supplier/add-car-supplier.component';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-cars-supplier',
  templateUrl: './cars-supplier.component.html',
  styleUrls: ['./cars-supplier.component.css'],
})
export class CarsSupplierComponent implements OnInit {
  showMoreInfo?: boolean = false;
  suppType?: type[];
  selectedType?: string;
  companies?: CompanyBranchList[];
  company?: string;
  name?: string = '';
  carSupplier?: CarSupplier[];
  selectedSupplier?: CarSupplier;
  reportDateTimeFormat?: string;
  suppGrade?: type[];
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingServiceService
  ) {}
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }

  showSuppList(selectedSupplier: CarSupplier) {
    this.selectedSupplier = selectedSupplier;
    this.showMoreInfo = true;
  }

  ngOnInit(): void {
    this.getSupplierType();
    this.getCompaniesPerUser();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getSupplierGrade();
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  getSupplierType() {
    this.dataService.getSupplierType().subscribe({
      next: (res) => {
        this.suppType = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  searchCarSupplier() {
    this.isLoading = true;
    this.dataService
      .findCarSupplier(this.company!, this.name!, this.selectedType!)
      .subscribe({
        next: (res) => {
          this.carSupplier = res.data;
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  handleSupplierUpdated(event: any) {
    this.carSupplier = event;
    // console.log(this.selectedSupplier);
  }
  deactivateUser(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deactivateUser(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message);
            this.searchCarSupplier();
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
  getSupplierGrade() {
    this.dataService.getSupplierGrade().subscribe({
      next: (res) => {
        this.suppGrade = res.data;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  openAddSupplierDialog() {
    this.dialog.open(AddCarSupplierComponent, {
      data: {
        types: this.suppType,
        company: this.company,
        grades: this.suppGrade,
      },
      width: '350px',
      maxHeight: '600px',
    });
  }
}
