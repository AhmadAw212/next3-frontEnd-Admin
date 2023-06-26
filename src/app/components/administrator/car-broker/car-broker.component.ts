import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarBroker } from 'src/app/model/car-broker';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddBrokerComponent } from '../add-dialogs/add-broker/add-broker.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
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
  dico?: any;
  dateFormats?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();

    this.dateFormatterService();
    this.getDico();
  }
  exportToExcel() {
    const data = this.brokers?.map((data) => {
      return {
        ID: data.id,
        Number: data.number,
        Description: data.description,
        Description2: data.description2,
        'Contact Info': data.contactInfo,
        Company: data.insuranceDescription,
        Email: data.email,
        Telephone: data.telephone,
        Reference: data.reference,
        referal: data.referal,
        'Rereferal Note': data.referalNote,
        'Created Date': this.datePipe.transform(
          data.sysCreatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.sysCreatedBy,

        'Updated Date': this.datePipe.transform(
          data.sysUpdatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': data.sysUpdatedBy,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Broker');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Broker.xlsx');
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  trackBrokerById(index: number, broker: CarBroker) {
    return broker.id;
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
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
          // this.authService.logout();
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
          this.alertifyService.dialogAlert('Error');
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
              // this.authService.logout();
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
            // this.authService.logout();
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
