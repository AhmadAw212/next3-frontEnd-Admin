import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarExpert } from 'src/app/model/car-expert';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { ExpertCompany } from 'src/app/model/expert-company';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddExpertCompanyComponent } from '../../add-dialogs/add-expert-company/add-expert-company.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-expert-company-list',
  templateUrl: './expert-company-list.component.html',
  styleUrls: ['./expert-company-list.component.css'],
})
export class ExpertCompanyListComponent implements OnInit, OnChanges {
  @Input() selectedExpert?: CarExpert;
  expertCompanies?: ExpertCompany[];
  companies?: CompanyBranchList[];
  company?: string;
  updatedExpCompany?: ExpertCompany[] = [];
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
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {}

  ngOnInit(): void {
    this.getExpertCompany();
    this.getCompaniesPerUser();
    this.userRolesService.getUserRoles();
    this.dateFormatterService();
    // console.log(this.selectedExpert);
    this.getDico();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  exportToExcel() {
    const data = this.expertCompanies?.map((data) => {
      return {
        Insurance: data.insuranceDesc,
        'Initial Count': data.initialCount,
        Ratio: data.ratio,
        'All Expert Dispatch Count': data.dispatchCount,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expert Companies');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Expert_Companies.xlsx');
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    this.getExpertCompany();
  }
  trackExpCompanyeById(index: number, expertComp: ExpertCompany) {
    return expertComp.expertCompanyId;
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        // console.log(this.companies);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }
  findAndReplaceExpert(
    updatedExpCompany: ExpertCompany[],
    expert: ExpertCompany
  ): void {
    const index = updatedExpCompany.findIndex(
      (item) => item.expertCompanyId === expert.expertCompanyId
    );
    if (index !== -1) {
      updatedExpCompany.splice(index, 1);
    }
    updatedExpCompany.push({
      expertCompanyId: expert.expertCompanyId,
      insuranceId: expert.insuranceId,
      initialCount: expert.initialCount,
      ratio: expert.ratio,
    });
  }

  onTdBlur(
    event: FocusEvent,
    expert: ExpertCompany,
    property: 'ratio' | 'initialCount'
  ): void {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = expert[property];
    const newValue = tdElement.innerText.trim();
    const updatedExpCompany = this.updatedExpCompany ?? [];
    // expert[property] = parseFloat(newValue);

    if (oldValue !== parseFloat(newValue)) {
      expert[property] = parseFloat(newValue);
      this.findAndReplaceExpert(updatedExpCompany, expert);
      console.log(this.updatedExpCompany);
    }
  }

  onDropdownChange(
    event: Event,
    expert: ExpertCompany,
    property: 'insuranceId'
  ): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedExpert = this.updatedExpCompany ?? [];

    this.findAndReplaceExpert(updatedExpert, expert);
    console.log(this.updatedExpCompany);
  }
  updateExpertCompany() {
    if (this.updatedExpCompany?.length) {
      const expertId = this.selectedExpert?.id!;
      this.dataService
        .updateExpertCompany(expertId, this.updatedExpCompany)
        .subscribe({
          next: (res) => {
            const modifiedFields = document.querySelectorAll('.updated-row');
            modifiedFields.forEach((field) => {
              field.classList.remove('updated-row');
            });

            this.alertifyService.success(res.message!);
            this.updatedExpCompany = [];

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

  getExpertCompany() {
    const expertId = this.selectedExpert?.id!;
    this.dataService.getExpertCompany(expertId).subscribe({
      next: (res) => {
        this.expertCompanies = res.data;
        // console.log(res);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          //this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  deleteExpertCompany(expertCompanyId: string) {
    const expertId = this.selectedExpert?.id!;
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this expert ?',
      () => {
        this.dataService
          .deleteExpertCompany(expertId, expertCompanyId)
          .subscribe({
            next: (data) => {
              this.alertifyService.error(data.title);
              // this.expertSearchResult = data.data;
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

  openAddExpertDialog() {
    this.dialog.open(AddExpertCompanyComponent, {
      data: { companies: this.companies, selectedExpert: this.selectedExpert },
    });
  }
}
