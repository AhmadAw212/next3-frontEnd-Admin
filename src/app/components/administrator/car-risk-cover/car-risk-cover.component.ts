import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CarCover } from 'src/app/model/car-cover';
import { CoverRisk } from 'src/app/model/cover-risk';
import { AddRiskCoverComponent } from './add-risk-cover/add-risk-cover.component';
import { type } from 'src/app/model/type';
@Component({
  selector: 'app-car-risk-cover',
  templateUrl: './car-risk-cover.component.html',
  styleUrls: ['./car-risk-cover.component.css'],
})
export class CarRiskCoverComponent implements OnInit, OnChanges {
  selectedRow!: HTMLElement;
  @Input() dico?: any;
  isLoading: boolean = false;
  dateFormats?: any;
  @Input() selectedCover?: CarCover;
  carCoverRisk?: CoverRisk[];
  cardTypes?: type[];
  coverRisk?: type[];
  updatedCoverValues: CoverRisk[] = [];
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

  ngOnChanges(changes: SimpleChanges): void {
    this.searchCarCoverRisk();
  }

  ngOnInit(): void {
    this.dateFormatterService();
    // this.getDico();
    // this.getcardType();
    // this.getFinancial();
    this.userRolesService.getUserRoles();
    // this.searchCarCoverRisk();
  }
  trackCoverById(index: number, coverRisk: CoverRisk) {
    return coverRisk.id;
  }

  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
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

  exportToExcel() {
    const data = this.carCoverRisk?.map((cover) => {
      return {
        ID: cover.id,
        'Card Type': cover.cardType_desc,
        'Risk Cover': cover.financialTypeLov_desc,
        // Company: cover.insuranceDesc,
        'Created Date': this.datePipe.transform(
          cover.sysCreatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Created By': cover.sysCreatedBy,
        'Updated Date': this.datePipe.transform(
          cover.sysUpdatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': cover.sysUpdatedBy,
      };
    });

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Covers Risk');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert the buffer to a Blob and save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Covers_Risk.xlsx');
  }
  dateFormatterService() {
    this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }

  searchCarCoverRisk() {
    const companyId = this.selectedCover?.insuranceId!;
    const coverType = this.selectedCover?.type!;
    this.dataService.searchRiskCover(companyId, coverType).subscribe({
      next: (res) => {
        this.carCoverRisk = res.data;
        // console.log(res.data);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        // console.log(err);
      },
    });
  }

  deleteCoverRisk(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCoverRisk(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message);
            this.searchCarCoverRisk();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              // this.authService.logout();
              this.alertifyService.dialogAlert(err.error.message);
            }
          },
        });
      }
    );
  }
  openAddCoverRiskDialog() {
    const dialogRef = this.dialog.open(AddRiskCoverComponent, {
      data: {
        dico: this.dico,
        selectedCover: this.selectedCover,
        cardTypes: this.cardTypes,
        coverRisk: this.coverRisk,
      },
      width: '350px',
      // maxHeight: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarCoverRisk();
    });
  }
}
