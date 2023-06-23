import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Branch } from 'src/app/model/branch';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddBranchComponent } from '../add-dialogs/add-branch/add-branch.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-branch-config',
  templateUrl: './branch-config.component.html',
  styleUrls: ['./branch-config.component.css'],
})
export class BranchConfigComponent implements OnInit {
  selectedRow!: HTMLElement;
  companies?: CompanyBranchList[];
  company?: string;
  branches?: Branch[];
  code?: string = '';
  description?: string = '';
  isLoading?: boolean = false;
  reportDateTimeFormat?: string;
  dico?: any;
  updatedBranch?: Branch[] = [];
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

  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getDico();
  }
  exportToExcel() {
    const data = this.branches?.map((data) => {
      return {
        ID: data.id,
        Code: data.description,
        Description: data.description,
        'Arabic description': data.arabic_description,
        Company: data.insuranceDescription,
        'Address 1': data.address1,
        'Address 2': data.address2,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Branch Configuration');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Branch_config.xlsx');
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  trackBranchById(index: number, branch: Branch) {
    return branch.id;
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
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

  getBranchesList() {
    this.isLoading = true;
    this.dataService
      .getBranches(this.company!, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.branches = res.data;
          // console.log(this.branches);
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

  deleteBranch(branchId: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteBranch(branchId).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.getBranchesList();
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

  onTdBlur(
    event: FocusEvent,
    branch: Branch,
    property:
      | 'code'
      | 'description'
      | 'address1'
      | 'address2'
      | 'arabic_description'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = branch[property];
    const newValue = tdElement.innerText.trim();

    if (oldValue !== newValue) {
      branch[property] = newValue;

      if (!this.updatedBranch) {
        this.updatedBranch = [];
      }

      const index = this.updatedBranch.findIndex(
        (item) => item.id === branch.id
      );
      if (index !== -1) {
        this.updatedBranch.splice(index, 1);
      }

      this.updatedBranch.push({
        id: branch.id,
        insuranceId: branch.insuranceId,
        code: branch.code,
        description: branch.description,
        arabic_description: branch.arabic_description,
        address1: branch.address1,
        address2: branch.address2,
      });

      console.log(this.updatedBranch);
    }
  }

  updateBranch() {
    if (this.updatedBranch?.length) {
      this.dataService.updateBranch(this.updatedBranch).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message!);
          this.updatedBranch = [];

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

  addBranchDialog() {
    this.dialog.open(AddBranchComponent, { data: this.company });
  }
}
