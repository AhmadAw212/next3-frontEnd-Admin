import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarBroker } from 'src/app/model/car-broker';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddBrokerComponent } from '../add-dialogs/add-broker/add-broker.component';

@Component({
  selector: 'app-car-broker',
  templateUrl: './car-broker.component.html',
  styleUrls: ['./car-broker.component.css'],
})
export class CarBrokerComponent implements OnInit {
  company?: string;
  description?: string = '';
  number?: string = '';
  isLoading?: boolean = false;
  selectedRow!: HTMLElement;
  companies?: CompanyBranchList[];
  brokers: CarBroker[] = [];
  updatedBroker?: CarBroker[] = [];
  reportDateTimeFormat?: string;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
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

  searchCarBroker() {
    this.isLoading = true;
    this.dataService
      .searchCarBroker(this.company!, this.number!, this.description!)
      .subscribe({
        next: (res) => {
          this.brokers = res.data;
          // console.log(this.brokers);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  deleteBroker(brokerId: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteBroker(brokerId).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarBroker();
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
  findAndReplaceExpert(updatedBroker: CarBroker[], broker: CarBroker): void {
    const index = updatedBroker.findIndex((item) => item.id === broker.id);
    if (index !== -1) {
      updatedBroker.splice(index, 1);
    }

    const {
      sysCreatedDate,
      sysCreatedBy,
      sysUpdatedDate,
      sysUpdatedBy,
      versionNUmber,
      ...updatedProperties
    } = broker;

    updatedBroker.push(updatedProperties);
  }
  onTdBlur(event: FocusEvent, broker: CarBroker, property: keyof CarBroker) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = broker[property];
    const newValue = tdElement.innerText.trim();
    const brokerUpdate = this.updatedBroker ?? [];
    if (oldValue !== newValue) {
      broker[property] = newValue;

      this.findAndReplaceExpert(brokerUpdate, broker);

      console.log(this.updatedBroker);
    }
  }

  updateBroker() {
    if (this.updatedBroker?.length) {
      this.dataService.updateBroker(this.updatedBroker).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          this.updatedBroker = [];

          console.log(res);
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

  openAddBrokerDialog() {
    const dialofRef = this.dialog.open(AddBrokerComponent, {
      data: { insuranceId: this.company },
      width: '350px',
      height: '600px',
    });
    dialofRef.afterClosed().subscribe(() => {
      this.searchCarBroker();
    });
  }
}
