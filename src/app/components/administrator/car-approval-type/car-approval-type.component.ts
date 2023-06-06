import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarApprovalType } from 'src/app/model/car-approval-type';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddApprovalTypeComponent } from '../add-dialogs/add-approval-type/add-approval-type.component';

@Component({
  selector: 'app-car-approval-type',
  templateUrl: './car-approval-type.component.html',
  styleUrls: ['./car-approval-type.component.css'],
})
export class CarApprovalTypeComponent implements OnInit {
  company?: string;
  companies?: CompanyBranchList[];
  isLoading?: boolean = false;
  selectedRow!: HTMLElement;
  carAppType?: CarApprovalType[];
  reportDateTimeFormat?: string;
  updatedApprovalType?: CarApprovalType[] = [];
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.dateFormatterService();
  }

  dateFormatterService() {
    this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.closest('tr') as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  findAndReplaceExpert(
    updatedBroker: CarApprovalType[],
    approvalType: CarApprovalType
  ): void {
    const index = updatedBroker.findIndex(
      (item) => item.id === approvalType.id
    );
    if (index !== -1) {
      updatedBroker.splice(index, 1);
    }

    updatedBroker.push({
      id: approvalType.id,
      applicationType: approvalType.applicationType,
      appUserId: approvalType.appUserId,
      amountTo: approvalType.amountTo,
      amountFrom: approvalType.amountFrom,
      sendEmail: approvalType.sendEmail,
    });
  }

  onTdBlur(
    event: FocusEvent,
    approvalType: CarApprovalType,
    property: 'applicationType' | 'amountTo' | 'amountFrom'
  ): void {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = approvalType[property];
    const newValue = tdElement.innerText.trim();
    const updatedApprovalType = this.updatedApprovalType ?? [];

    if (oldValue !== newValue) {
      if (property === 'amountTo' || property === 'amountFrom') {
        approvalType[property] = parseInt(newValue);
      } else {
        approvalType[property] = newValue;
      }
      this.findAndReplaceExpert(updatedApprovalType, approvalType);
    }

    // console.log(this.updatedApprovalType);
  }

  onDropdownChange(
    event: Event,
    approvalType: CarApprovalType,
    property: 'sendEmail'
  ) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedApprovalType = this.updatedApprovalType ?? [];
    const index = updatedApprovalType.findIndex(
      (item) => item.id === approvalType.id
    );
    this.findAndReplaceExpert(updatedApprovalType, approvalType);
    // console.log(updatedApprovalType);
  }
  updateCarApprovalType() {
    if (this.updatedApprovalType?.length) {
      this.dataService
        .updateCarApprovalType(this.updatedApprovalType)
        .subscribe({
          next: (res) => {
            this.alertifyService.success(res.message!);
            this.updatedApprovalType = [];

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

  searchCarAppType() {
    this.isLoading = true;
    this.dataService.searchCarAppType(this.company!).subscribe({
      next: (res) => {
        this.carAppType = res.data;
        // console.log(res);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  deleteApprovalType(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteApprovalType(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarAppType();
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

  addApprovalTypeDialog() {
    this.dialog.open(AddApprovalTypeComponent, {
      width: '300px',
      data: { insuranceId: this.company },
    });
  }
}
