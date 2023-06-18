import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Branch } from 'src/app/model/branch';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddBranchComponent } from '../add-dialogs/add-branch/add-branch.component';

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
  updatedBranch?: Branch[] = [];
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
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
