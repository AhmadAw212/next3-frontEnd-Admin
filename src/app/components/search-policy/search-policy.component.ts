import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { type } from 'src/app/model/type';
import { Policy } from 'src/app/model/policy';
import { ViewPolicyDialogComponent } from '../view-policy/view-policy-dialog/view-policy-dialog.component';
@Component({
  selector: 'app-search-policy',
  templateUrl: './search-policy.component.html',
  styleUrls: ['./search-policy.component.css'],
})
export class SearchPolicyComponent implements OnInit, OnDestroy {
  dico?: any;
  selectedRow!: HTMLElement;
  policies?: any;
  policySearchSubscribtion?: Subscription;
  policySearch?: type[];
  getInsuranceSubscription?: Subscription;
  insurance?: any[];
  policyTypeSubscription?: Subscription;
  policyType?: type[];
  searchByValue?: string = 'PlateNumber';
  policyTypeValue?: string = 'ALL_TPL';
  searchValue?: string = '';
  insuranceValue?: string = 'ALL';
  asOfDateValue?: Date;
  policyResult?: Policy[];
  productTypeValue: string = 'ALL';
  private searchTimer: any;
  productTypes?: any;
  loading: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {
    // Step 1: Parse the date string in Angular to get a JavaScript Date object
    this.asOfDateValue = new Date();
  }
  ngOnDestroy(): void {
    if (
      this.policySearchSubscribtion ||
      this.getInsuranceSubscription ||
      this.policyTypeSubscription
    ) {
      this.policySearchSubscribtion?.unsubscribe();
      this.getInsuranceSubscription?.unsubscribe();
      this.policyTypeSubscription?.unsubscribe();
    }
  }
  ngOnInit(): void {
    // this.dateFormatterService();
    this.getDico();
    // this.userRolesService.getUserRoles();
    this.policySearchLov();
    this.getCompaniesPerUser();
    this.getPolicyTypeLovFindAll();
  }
  highlightRow(event: Event) {
    const clickedField = event.target as HTMLElement;
    const clickedRow = clickedField.closest('tr') as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow;
    this.selectedRow.classList.add('highlight');
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  viewPolicyComponent(selectedPolicy: string) {
    // console.log(selectedPolicy);
    this.dialog.open(ViewPolicyDialogComponent, {
      data: {
        carId: selectedPolicy,
      },
      width: '1000px',
      maxHeight: '600px',
    });
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  exportToExcel() {
    const data = this.policyResult?.map((data) => {
      return {
        Company: data.insuranceDesc,
        'Client Name': data.clientName,
        Plate: data.carPlate,
        'Car Model': data.brandDescription,
        YOM: data.carYear,
        'Policy Type': data.policyTypeDesc,
        'Policy Number': data.policyNumber,
        'Policy Amendment': data.policyAmendment,
        Status: data.amendmentDesc,
        'Issue Date': this.datePipe.transform(
          data.policyIssueDate,
          this.dateFormat('reportDateFormat')
        ),
        'Effective Date': this.datePipe.transform(
          data.policyEffectiveDate,
          this.dateFormat('reportDateFormat')
        ),
        'Expiry Date': this.datePipe.transform(
          data.policyExpiryDate,
          this.dateFormat('reportDateFormat')
        ),
        'Car Chasis': data.carChassis,
        Branch: data.branchDesc,
        Broker: data.brokerName,
      };
    });

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Policy');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert the buffer to a Blob and save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Policy.xlsx');
  }

  policySearchLov() {
    this.policySearchSubscribtion = this.dataService
      .policySearchLov()
      .subscribe({
        next: (res) => {
          this.policySearch = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
  getCompaniesPerUser() {
    this.getInsuranceSubscription = this.dataService
      .getCompaniesListByCurrentUser()
      .subscribe({
        next: (res) => {
          this.insurance = res.companyList;
          // this.insuranceValue = this.insurance![0].companyId;

          const newRecord = {
            companyId: 'ALL',
            companyName: 'ALL',
          };
          this.insurance?.push(newRecord);
          // console.log(this.companies);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
  }
  // getInsuranceLovFindAll() {
  //   this.getInsuranceSubscription = this.dataService
  //     .getInsuranceLovFindAll()
  //     .subscribe({
  //       next: (res) => {
  //         this.insurance = res.data;
  //         const newRecord = {
  //           insuranceCode: 'ALL',
  //           insuranceDesc: 'ALL',
  //         };
  //         this.insurance?.push(newRecord);
  //         // console.log(res);
  //       },
  //       error: (err) => {
  //         this.alertifyService.error(err.error.message);
  //       },
  //     });
  // }
  getPolicyTypeLovFindAll() {
    this.policyTypeSubscription = this.dataService
      .getPolicyTypeLovFindAll()
      .subscribe({
        next: (res) => {
          this.policyType = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
  searchPolicy() {
    this.loading = true;
    const formattedDate = this.datePipe.transform(
      this.asOfDateValue,
      'dd-MMM-YYYY'
    );
    if (this.productTypeValue === null) {
      this.productTypeValue = '';
    }
    this.dataService
      .searchPolicy(
        this.searchByValue!,
        this.searchValue!,
        this.policyTypeValue!,
        formattedDate!,
        this.insuranceValue!,
        this.productTypeValue!
      )
      .subscribe({
        next: (res) => {
          this.policyResult = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
  searchProductTypes(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const name = event.term;

      this.dataService.getProductType(this.insuranceValue!, name).subscribe({
        next: (res) => {
          this.productTypes = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
          console.log(err);
        },
      });
    }, 300);
  }
}
