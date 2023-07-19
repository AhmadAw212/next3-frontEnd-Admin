import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarTrademark } from 'src/app/model/car-trademark';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddTrademarkDialogComponent } from '../add-dialogs/add-trademark-dialog/add-trademark-dialog.component';
import { UpdateTrademarkDialogComponent } from '../update-dialogs/update-trademark-dialog/update-trademark-dialog.component';
import { CarShape } from 'src/app/model/car-shape';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-car-trademark',
  templateUrl: './car-trademark.component.html',
  styleUrls: ['./car-trademark.component.css'],
})
export class CarTrademarkComponent implements OnInit {
  code?: string = '';
  description?: string = '';
  @Input() carBrand?: CarsBrand;
  @Input() carTrademark?: CarTrademark[];
  selectedTrademark?: CarTrademark;
  carShape?: CarShape[];
  showCarShape = false;
  reportDateTimeFormat?: string;
  selectedRow!: HTMLElement;
  @Input() dico?: any;
  dateFormats?: any;
  selectedTrademarkId?: string;
  @Output() sendTrademarkId = new EventEmitter<string>();

  selectedShapeId?: string;
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
    // this.dateFormatterService();
    // this.getDico();
    // this.userRolesService.getUserRoles();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  saveTrademarkId(trademarkId: CarTrademark) {
    this.selectedTrademarkId = trademarkId.id;

    this.sendTrademarkId.emit(this.selectedTrademarkId);
  }
  selectTrademarkId(data: string) {
    this.selectedTrademarkId = data;
    console.log(this.selectedTrademarkId);
  }

  exportToExcel() {
    const data = this.carTrademark?.map((data) => {
      return {
        ID: data.id,
        Code: data.code,
        Description: data.description,
        'Created Date': this.datePipe.transform(
          data.created_date,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.createdBy,
        'Updated Date': this.datePipe.transform(
          data.updated_date,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Car TradeMark');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Car_Trademark.xlsx');
  }
  getDico() {
    this.dicoService.getDico();
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
  trackTrademarkById(index: number, brand: CarTrademark) {
    return brand.id;
  }
  highlightRow(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedRow = clickedElement.closest('tr');

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow!;
    this.selectedRow.classList.add('highlight');
  }
  searchCarShape(trademarkId: string, tradeMark: CarTrademark) {
    this.showCarShape = true;
    this.selectedTrademark = tradeMark;
    this.dataService.searchCarShape(trademarkId).subscribe({
      next: (res) => {
        this.carShape = res.data.map((res: CarShape) => {
          return {
            ...res,
            logo: `data:image/jpeg;base64,${res.logo}`,
          };
        });
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }

  carTrademarkSearch() {
    this.showCarShape = false;
    const id = this.carBrand?.carBrandId!;
    this.dataService
      .searchCarTrademarks(id, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.carTrademark = res.data.map((res: CarTrademark) => {
            return {
              ...res,
              logo: `data:image/jpeg;base64,${res.logo}`,
            };
          });
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
  }

  deleteTrademark(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarTrademark(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title!);
            this.carTrademarkSearch();
            // console.log(data);
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              //this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }
  openAddCarTrademarkDialog() {
    const dialogRef = this.dialog.open(AddTrademarkDialogComponent, {
      data: this.carBrand,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.carTrademarkSearch();
    });
  }

  updateTrademarkDialog(carTrademark: CarTrademark) {
    const dialogRef = this.dialog.open(UpdateTrademarkDialogComponent, {
      data: carTrademark,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.carTrademarkSearch();
      this.showCarShape = true;
    });
  }
}
