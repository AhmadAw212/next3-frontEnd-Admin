import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreDomain } from 'src/app/model/core-domain';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddDomainDialogComponent } from '../add-dialogs/add-domain-dialog/add-domain-dialog.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { CoreDomainValue } from 'src/app/model/core-domain-value';

@Component({
  selector: 'app-core-domain',
  templateUrl: './core-domain.component.html',
  styleUrls: ['./core-domain.component.css'],
})
export class CoreDomainComponent implements OnInit {
  code: string = '';
  description: string = '';
  domainData?: CoreDomain[] = [];
  sysActiveFlag?: number;
  reportDateTimeFormat?: string;
  updatedDomainValues?: CoreDomain[] = [];
  domain?: CoreDomain;
  domainValuesList?: CoreDomainValue[];
  showDomainValue?: boolean = false;
  selectedRow!: HTMLElement;
  isLoading?: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}
  highlightRow(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedRow = clickedElement.closest('tr');

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow!;
    this.selectedRow.classList.add('highlight');
  }
  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }

  onTdBlur(
    event: FocusEvent,
    domain: CoreDomain,
    property: 'code' | 'description' | 'preference_code'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = domain[property];
    const newValue = tdElement.innerText.trim();
    const updatedDomainValues = this.updatedDomainValues ?? [];

    const index = updatedDomainValues.findIndex(
      (item) => item.id === domain.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    const sysActiveFlag = domain.sysActiveFlag ?? false;
    if (oldValue !== newValue) {
      domain[property] = newValue;
      this.updatedDomainValues?.push({
        id: domain.id,
        code: domain.code,
        description: domain.description,
        preference_code: domain.preference_code,
        sysActiveFlag,
      });
      console.log(this.updatedDomainValues);
    }
  }

  onCheckboxChange(domain: CoreDomain) {
    const sysActiveFlag = domain.sysActiveFlag ?? false;
    const updatedDomainValues = this.updatedDomainValues ?? [];
    const index = updatedDomainValues.findIndex(
      (item) => item.id === domain.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    this.updatedDomainValues?.push({
      id: domain.id,
      code: domain.code,
      description: domain.description,
      preference_code: domain.preference_code,
      sysActiveFlag,
    });
    console.log(this.updatedDomainValues);
  }

  getDomainValuesData(id: string, domain: CoreDomain) {
    // console.log(domain);
    this.showDomainValue = true;
    this.domain = domain;
    this.dataService.coreDomainValue(id).subscribe({
      next: (res) => {
        this.domainValuesList = res.data;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  coreDomainSearch() {
    this.showDomainValue = false;
    this.isLoading = true;
    this.dataService.coreDomainSearch(this.code, this.description).subscribe({
      next: (res) => {
        this.domainData = res.data;

        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  deleteResource(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteDomain(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.coreDomainSearch();
            // console.log(data);
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

  updateDomain() {
    if (this.updatedDomainValues?.length) {
      this.dataService.updateDomain(this.updatedDomainValues).subscribe({
        next: (res) => {
          this.alertifyService.dialogAlert(res.title!);
          this.updatedDomainValues = [];
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

  openAddDomainDialog() {
    this.dialog.open(AddDomainDialogComponent);
  }
}
