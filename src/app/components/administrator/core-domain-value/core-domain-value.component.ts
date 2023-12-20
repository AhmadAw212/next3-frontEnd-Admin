import { Component, Input, OnInit } from '@angular/core';
import { CoreDomain } from 'src/app/model/core-domain';
import { CoreDomainValue } from 'src/app/model/core-domain-value';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddDomainValueDialogComponent } from '../add-dialogs/add-domain-value-dialog/add-domain-value-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-core-domain-value',
  templateUrl: './core-domain-value.component.html',
  styleUrls: ['./core-domain-value.component.css'],
})
export class CoreDomainValueComponent implements OnInit {
  @Input() domainValues?: CoreDomainValue[];
  @Input() domain?: CoreDomain;
  updatedDomainValues?: CoreDomainValue[] = [];
  code: string = '';
  description: string = '';
  reportDateTimeFormat?: string;
  selectedRow!: HTMLElement;
  @Input() dico?: any;
  loading: boolean = false;
  dateFormats?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService
  ) {}

  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }

  trackDomainById(index: number, domain: CoreDomainValue) {
    return domain.id;
  }
  ngOnInit(): void {
    this.dateFormatterService();
    // this.getDico();
    // this.userRolesService.getUserRoles();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  domainValueSearch() {
    const id = this.domain?.id!;
    this.loading = true;
    this.dataService
      .coreDomainValueSearch(id, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.domainValues = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  // onTdBlur(
  //   event: FocusEvent,
  //   domainValue: CoreDomainValue,
  //   property: keyof CoreDomainValue
  // ) {
  //   const tdElement = event.target as HTMLTableCellElement;
  //   const newValue = tdElement.innerText.trim();

  //   // Use object destructuring to extract properties and exclude the unwanted ones
  //   const {
  //     sysCreatedBy,
  //     sysUpdatedBy,
  //     sysCreatedDate,
  //     sysUpdatedDate,
  //     ...restOfDomainValue
  //   } = domainValue;

  //   // Check if any value has changed
  //   if (newValue !== domainValue[property]) {
  //     const updatedDomainValue: CoreDomainValue = {
  //       ...restOfDomainValue, // Spread the rest of the properties
  //       [property]: newValue,
  //     };

  //     const updatedDomainValues = this.updatedDomainValues ?? [];

  //     // Find the index of the domainValue in the updated list
  //     const index = updatedDomainValues.findIndex(
  //       (item) => item.id === domainValue.id
  //     );

  //     if (index !== -1) {
  //       updatedDomainValues[index] = updatedDomainValue; // Update the existing item
  //     } else {
  //       updatedDomainValues.push(updatedDomainValue); // Add the updated item
  //     }

  //     console.log(updatedDomainValues);
  //     this.updatedDomainValues = [...updatedDomainValues]; // Ensure immutability
  //   }
  // }

  onTdBlur(
    event: FocusEvent,
    domain: CoreDomainValue,
    property:
      | 'code'
      | 'description'
      | 'val1'
      | 'val2'
      | 'val3'
      | 'val4'
      | 'val5'
      | 'val6'
      | 'val7'
      | 'val8'
      | 'val9'
      | 'val10'
      | 'val11'
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

    // const sysActiveFlag = domain.sysActiveFlag ?? false;
    if (oldValue !== newValue) {
      domain[property] = newValue;
      this.updatedDomainValues?.push({
        id: domain.id,
        code: domain.code,
        description: domain.description,
        val1: domain.val1,
        val2: domain.val2,
        val3: domain.val3,
        val4: domain.val4,
        val5: domain.val5,
        val6: domain.val6,
        val7: domain.val7,
        val8: domain.val8,
        val9: domain.val9,
        val10: domain.val10,
        val11: domain.val11,
        coreDomainId: domain.coreDomainId,
      });
      console.log(this.updatedDomainValues);
    }
  }

  onCheckboxChange(domainValue: CoreDomainValue) {
    // const sysActiveFlag = domainValue.sysActiveFlag ?? false;
    const updatedDomainValues = this.updatedDomainValues ?? [];
    const index = updatedDomainValues.findIndex(
      (item) => item.id === domainValue.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }

    this.updatedDomainValues?.push({
      id: domainValue.id,
      code: domainValue.code,
      description: domainValue.description,
      val1: domainValue.val1,
      val2: domainValue.val2,
      val3: domainValue.val3,
      val4: domainValue.val4,
      val5: domainValue.val5,
      val6: domainValue.val6,
      val7: domainValue.val7,
      val8: domainValue.val8,
      val9: domainValue.val9,
      val10: domainValue.val10,
      val11: domainValue.val11,
      coreDomainId: domainValue.coreDomainId,
    });
    // console.log(this.updatedDomainValues);
  }

  openAddDomainValueDialog() {
    const dialogData = {
      domainId: this.domain?.id,
      domainValues: this.domainValues,
    };
    const dialogRef = this.dialog.open(AddDomainValueDialogComponent, {
      data: dialogData,
      maxHeight: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.domainValues = dialogData.domainValues;
    });
  }

  getDomainValuesData(id: string) {
    this.loading = true;
    this.dataService.coreDomainValue(id).subscribe({
      next: (res) => {
        this.domainValues = res.data;
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
        // console.log(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  deleteDomainValue(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteDomainValue(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.getDomainValuesData(this.domain?.id!);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
          },
        });
      }
    );
  }

  updateDomainValue() {
    this.dataService
      .updateCoreDomainValue(this.updatedDomainValues!)
      .subscribe({
        next: (res) => {
          this.alertifyService.success(res.message!);
          this.updatedDomainValues = [];
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
}
