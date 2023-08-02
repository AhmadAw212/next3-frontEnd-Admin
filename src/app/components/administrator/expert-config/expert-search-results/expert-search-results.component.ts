import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarExpert } from 'src/app/model/car-expert';
import { CarSupplier } from 'src/app/model/car-supplier';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddExpertComponent } from '../../add-dialogs/add-expert/add-expert.component';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-expert-search-results',
  templateUrl: './expert-search-results.component.html',
  styleUrls: ['./expert-search-results.component.css'],
})
export class ExpertSearchResultsComponent implements OnInit {
  @Input() expertSearchResult?: CarExpert[];
  @Input() expGroup?: type[];
  group?: string;
  territory?: string;
  bodilyInjury?: string;
  exclusive?: string;
  secondExpert?: string;
  contract?: string;
  vip?: string;
  remarks?: string;
  ratio?: number;
  terrAddress?: type[];
  territoryName?: string = '';
  schedule?: type[];
  selectedRow!: HTMLElement;
  reportDateTimeFormat?: string;
  updatedExpert: CarExpert[] = [];
  isLoading: boolean = true;
  showExpertCompany?: boolean = false;
  selectedExpert?: CarExpert;
  dico?: any;
  dateFormats?: any;
  @Input() selectedSupplier?: CarSupplier;
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
  exportToExcel() {
    const data = this.expertSearchResult?.map((data) => {
      return {
        ID: data.id,
        Code: data.code,
        'Expert Name': data.expertName,
        Group: data.groupDesc,
        Territory: data.territory_name,
        'Bodily Injury': data.bodily_injury,
        VIP: data.vip,
        Exclusive: data.exclusive,
        'Second Expert': data.secondExpert,
        Contract: data.contract,
        Schedule: data.scheduleDesc,
        Remarks: data.remarks,
        Ratio: data.ratio,
        'Created Date': this.datePipe.transform(
          data.createdDate,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.createdBy,
        'Updated Date': this.datePipe.transform(
          data.updatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': data.updatedBy,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Experts');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Experts.xlsx');
  }
  ngOnInit(): void {
    this.territoryAddress();
    this.getSchedule();
    this.getDico();
    // this.userRolesService.getUserRoles();
    // this.dateFormatterService();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  showExpertCompanies(expert: CarExpert) {
    this.showExpertCompany = true;
    this.selectedExpert = expert;

    // console.log(expert);
  }

  trackExpertById(index: number, expert: CarExpert) {
    return expert.id;
  }
  findAndReplaceExpert(updatedExpert: CarExpert[], expert: CarExpert): void {
    const index = updatedExpert.findIndex((item) => item.id === expert.id);
    if (index !== -1) {
      updatedExpert.splice(index, 1);
    }

    updatedExpert.push({
      id: expert.id,
      groupCode: expert.groupCode,
      territory_code: expert.territory_code,
      schedule_code: expert.schedule_code,
      bodily_injury: expert.bodily_injury,
      vip: expert.vip,
      exclusive: expert.exclusive,
      secondExpert: expert.secondExpert,
      contract: expert.contract,
      remarks: expert.remarks,
      ratio: expert.ratio,
    });
  }
  onTdBlur(
    event: FocusEvent,
    expert: CarExpert,
    property: 'remarks' | 'ratio'
  ): void {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = expert[property];
    const newValue = tdElement.innerText.trim();
    const updatedExpert = this.updatedExpert ?? [];

    if (oldValue !== newValue) {
      if (property === 'ratio') {
        expert[property] = parseInt(newValue);
      } else {
        expert[property] = newValue;
      }
      this.findAndReplaceExpert(updatedExpert, expert);
      // console.log(this.updatedExpert);
    }
  }

  onDropdownChange(
    event: Event,
    expert: CarExpert,
    property: 'groupCode' | 'territory_code' | 'schedule_code'
  ): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedExpert = this.updatedExpert ?? {};

    this.findAndReplaceExpert(updatedExpert, expert);
    // console.log(this.updatedExpert);
  }
  onCheckboxChange(expert: CarExpert): void {
    const bodily_injury = expert.bodily_injury ?? false;
    const vip = expert.vip ?? false;
    const exclusive = expert.exclusive ?? false;
    const secondExpert = expert.secondExpert ?? false;
    const contract = expert.contract ?? false;
    const updatedExpert = this.updatedExpert ?? {};

    this.findAndReplaceExpert(updatedExpert, expert);
    console.log(this.updatedExpert);
  }
  // territoryAddress(event: any) {
  //   clearTimeout(this.searchTimer);
  //   this.searchTimer = setTimeout(() => {
  //     const name = event.term;
  //     this.dataService.territoryAddress(name).subscribe({
  //       next: (res) => {
  //         this.terrAddress = res.data;
  //         // console.log(res);
  //       },
  //       error: (err) => {
  //         this.alertifyService.dialogAlert('Error');
  //         console.log(err);
  //       },
  //     });
  //   }, 300);
  // }
  territoryAddress() {
    this.isLoading = true;
    this.dataService.territoryAddress(this.territoryName!).subscribe({
      next: (res) => {
        this.terrAddress = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  getSchedule() {
    this.dataService.getSchedule().subscribe({
      next: (res) => {
        this.schedule = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getSupplierExpert() {
    this.dataService.searchSupplierExpert().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openAddExpertDialog() {
    const dialogRef = this.dialog.open(AddExpertComponent, {
      data: {
        expGroups: this.expGroup,
        teritories: this.terrAddress,
        schedules: this.schedule,
        selectedSupplier: this.selectedSupplier,
      },
      width: '350px',
      maxHeight: '600px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getSupplierExpert();
    });
  }
  updateExpert() {
    if (this.updatedExpert?.length) {
      this.dataService.updateExpert(this.updatedExpert).subscribe({
        next: (res) => {
          const modifiedFields = document.querySelectorAll('.updated-row');
          modifiedFields.forEach((field) => {
            field.classList.remove('updated-row');
          });

          this.alertifyService.success(res.message!);
          this.updatedExpert = [];

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
  deleteExpert(expertId: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this expert ?',
      () => {
        this.dataService.deleteExpert(expertId).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title);
            this.expertSearchResult = data.data;
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

  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.closest('tr') as HTMLElement;
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
}
