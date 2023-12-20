import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarShape } from 'src/app/model/car-shape';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddShapeDialogComponent } from '../add-dialogs/add-shape-dialog/add-shape-dialog.component';
import { UpdateShapeDialogComponent } from '../update-dialogs/update-shape-dialog/update-shape-dialog.component';
import { CarTrademark } from 'src/app/model/car-trademark';
import { CarInfo } from 'src/app/model/car-info';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
@Component({
  selector: 'app-car-shape',
  templateUrl: './car-shape.component.html',
  styleUrls: ['./car-shape.component.css'],
})
export class CarShapeComponent implements OnInit {
  @Input() carShape?: CarShape[];
  @Input() selectedTrademark?: CarTrademark;
  carInfo?: CarInfo[];
  selectedShape?: CarShape;
  reportDateTimeFormat?: string;
  showCarInfo = false;
  selectedRow!: HTMLElement;
  @Input() dico?: any;
  @Output() sendShapeId = new EventEmitter<string>();
  selectedShapeId?: string;
  dateFormats?: any;
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
  ) {}

  ngOnInit(): void {
    // this.dateFormatService.dateFormatter();
    // this.dateFormatterService();
    // this.getDico();
    // this.userRolesService.getUserRoles();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  exportToExcel() {
    const data = this.carShape?.map((data) => {
      return {
        ID: data.carShapeId,
        Code: data.carShapeCode,
        Description: data.carShapeDescription,
        'Created Date': this.datePipe.transform(
          data.created_date,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.updated_date,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Car Shape');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Car_Shape.xlsx');
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  trackShapeById(index: number, brand: CarShape) {
    return brand.carShapeId;
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
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
  searchCarInfo(shapeId: string, selectedCarShapeId: CarShape) {
    this.loading = true;
    this.showCarInfo = true;
    this.selectedShape = selectedCarShapeId;
    this.dataService.getcarInfo(shapeId).subscribe({
      next: (res) => {
        this.carInfo = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  searchCarShape() {
    const trademarkId = this.selectedTrademark?.id!;
    this.loading = true;
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
        console.log(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  deleteCarShape(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarShape(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title!);
            // this.carTrademarkSearch();
            this.searchCarShape();
            // console.log(data);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    );
  }

  openAddCarShapeDialog(showText: boolean) {
    const dialog = this.dialog.open(AddShapeDialogComponent, {
      data: {
        trademark: this.selectedTrademark,
        showText: showText,
      },
    });
    dialog.afterClosed().subscribe(() => this.searchCarShape());
  }

  updateShapeDialog(carShape: CarShape) {
    const dialogRef = this.dialog.open(UpdateShapeDialogComponent, {
      data: carShape,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.searchCarShape();
      this.showCarInfo = true;
    });
  }

  saveShapeId(shapeId: CarShape) {
    this.selectedShapeId = shapeId.carShapeId;
    this.sendShapeId.emit(this.selectedShapeId);
    // console.log(this.selectedShapeId);
  }
}
