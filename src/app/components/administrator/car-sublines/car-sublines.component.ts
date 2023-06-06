import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarSublines } from 'src/app/model/car-sublines';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarSublineComponent } from '../add-dialogs/add-car-subline/add-car-subline.component';
import { UpdateCarSublineComponent } from '../update-dialogs/update-car-subline/update-car-subline.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-car-sublines',
  templateUrl: './car-sublines.component.html',
  styleUrls: ['./car-sublines.component.css'],
})
export class CarSublinesComponent implements OnInit {
  code?: string = '';
  description?: string = '';
  company?: string;
  companies?: CompanyBranchList[];
  carSubline?: CarSublines[];
  reportDateTimeFormat?: string;
  updatedSublineValue?: CarSublines[] = [];
  selectedRow!: HTMLElement;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getCompaniesPerUser();
    this.getDico();
  }

  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  highlightRow(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedRow = clickedElement.closest('tr');

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow!;
    this.selectedRow.classList.add('highlight');
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
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
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
  onTdBlur(
    event: FocusEvent,
    subline: CarSublines,
    property: 'code' | 'description' | 'notes'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = subline[property];
    const newValue = tdElement.innerText.trim();
    const updatedCoverValues = this.updatedSublineValue ?? [];

    const index = updatedCoverValues.findIndex(
      (item) => item.id === subline.id
    );
    if (index !== -1) {
      updatedCoverValues.splice(index, 1);
    }
    if (oldValue !== newValue) {
      subline[property] = newValue;
      this.updatedSublineValue?.push({
        id: subline.id,
        insuranceId: subline.insuranceId,
        code: subline.code,
        description: subline.description,
        notes: subline.notes,
      });
      console.log(this.updatedSublineValue);
    }
  }
  searchCarSublines() {
    this.dataService
      .searchCarSublines(this.company!, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.carSubline = res.data;
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
  }
  updateCarSubline() {
    if (this.updatedSublineValue?.length) {
      this.dataService.updateCarSubline(this.updatedSublineValue).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message!);
          this.updatedSublineValue = [];
          this.searchCarSublines();
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
  deleteCarSubline(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarSubline(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarSublines();
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

  openAddCarSubline() {
    const dialogRef = this.dialog.open(AddCarSublineComponent, {
      data: {
        InsuranceId: this.company,
      },
      width: '350px',
      // maxHeight: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarSublines();
    });
  }

  // updateCarSublineDialog(carSubline: CarSublines) {
  //   const dialogRef = this.dialog.open(UpdateCarSublineComponent, {
  //     data: { carSubline: carSubline },
  //     width: '350px',
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.searchCarSublines();
  //   });
  // }
}
