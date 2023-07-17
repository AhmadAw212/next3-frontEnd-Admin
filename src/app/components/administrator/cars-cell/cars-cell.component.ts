import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaseMngrSetup } from 'src/app/model/case-mngr-setup';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CarsCell } from 'src/app/model/cars-cell';
import { AddCellComponent } from './add-cell/add-cell.component';
import { DateTime } from 'luxon';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-cars-cell',
  templateUrl: './cars-cell.component.html',
  styleUrls: ['./cars-cell.component.css'],
})
export class CarsCellComponent implements OnChanges, OnInit {
  @Input() dico?: any;
  @Input() selectedCase?: CaseMngrSetup;
  @Input() dateFormats?: any;
  carsCell?: CarsCell[];
  selectedRow!: HTMLElement;
  isLoading?: boolean = false;
  substring?: string = '';
  users?: any[];
  updatedCell: CarsCell[] = [];
  @Input() showCellSetup?: boolean = false;
  selectedCell?: CarsCell;
  reportDateFormat?: string;
  isDateVisible: boolean = true;
  // @Output() showCellSetupEmit = new EventEmitter<boolean>();
  myDateValue?: Date;
  formattedDate: string | null = null;

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
    // this.reportDateFormat = this.dateFormat('reportDateFormat');
    // console.log(this.reportDateFormat);
  }
  formatDate(date: string) {
    // const backendDate = new Date(date);
    // Replace 'yyyy-MM-dd' with your desired date format
    return this.datePipe.transform(date, this.dateFormat('reportDateFormat'));
    // console.log(dates);
  }

  ngOnInit(): void {
    this.getUsers();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getCarsCell();
  }
  showSetup(selectedCell: CarsCell) {
    this.selectedCell = selectedCell;
    this.showCellSetup = true;
  }
  dateFormat(dateId: string) {
    const dateFormat = this.dateFormatService.getDateFormat(dateId);
    return dateFormat;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  trackById(index: number, carsCell: CarsCell) {
    return carsCell.id;
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

  exportToExcel() {
    const dico_products_reserve = this.dico.dico_product_reserve;
    const data = this.carsCell?.map((data) => {
      return {
        ID: data.id,
        'Manager ID': data.managerId,
        'Manager Firstname': data.managerFirstName,
        'Manager Familyname': data.managerFirstName,
        'Cell Manager': data.cellManager,
        Out: data.cellOUt,
        'Out Date': this.datePipe.transform(
          data.cellOutDateValue,
          this.dateFormat('reportDateFormat')
        ),
        'Cell Ratio': data.cellRatio,
        'Show In List': data.showInList,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cars Cell');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'Cars_Cell.xlsx');
  }

  getCarsCell() {
    this.showCellSetup = false;
    const id = this.selectedCase?.id!;
    this.dataService.getCarsCells(id).subscribe({
      next: (res) => {
        this.carsCell = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateManagerDetails(cases: CarsCell) {
    const selectedUser = this.users?.find(
      (user) => user.username === cases.managerId
    );

    if (selectedUser) {
      // Update the managerId, managerFirstName, and managerLastName properties
      cases.managerId = selectedUser.username;
      cases.managerFirstName = selectedUser.firstName;
      cases.managerLastName = selectedUser.lastName;
    }

    // Find the existing cell in the updatedCell array, if it exists
    const existingCell = this.updatedCell.find((item) => item.id === cases.id);

    if (existingCell) {
      // If the existing cell is found, update the specific properties and keep the date
      existingCell.managerId = cases.managerId;
      existingCell.managerFirstName = cases.managerFirstName;
      existingCell.managerLastName = cases.managerLastName;
    } else {
      // If the cell does not exist in the updatedCell array, add it with the current properties
      this.updatedCell.push({
        ...cases,
      });
    }

    console.log(this.updatedCell);
  }
  findAndReplaceExpert(updatedCell: CarsCell[], carsCell: CarsCell): void {
    const index = updatedCell.findIndex((item) => item.id === carsCell.id);
    if (index !== -1) {
      updatedCell.splice(index, 1);
    }

    updatedCell.push({
      id: carsCell.id,
      managerId: carsCell.managerId,
      managerSetup_id: carsCell.managerSetup_id,
      cellCode: carsCell.cellCode,
      cellType: carsCell.cellType,
      managerFirstName: carsCell.managerFirstName,
      managerLastName: carsCell.managerLastName,
      // cellOutDateValue: carsCell.cellOutDateValue,
      cellManager: carsCell.cellManager,
      cellOUt: carsCell.cellOUt,
      cellOutDate: carsCell.cellOutDate,
      cellRatio: carsCell.cellRatio,
      showInList: carsCell.showInList,
    });
  }
  onDropdownChange(event: Event, cell: CarsCell): void {
    const events = (event.target as HTMLSelectElement).value;
    this.updatedCell.push({
      ...cell,
      managerId: events,
    });

    console.log(this.updatedCell);
  }
  onCheckboxChange(carsCell: CarsCell) {
    const cellManager = carsCell.cellManager ?? false;
    const cellOUt = carsCell.cellOUt ?? false;
    const showInList = carsCell.showInList ?? false;

    // Find the existing cell in the updatedCell array, if it exists
    const existingCell = this.updatedCell.find(
      (item) => item.id === carsCell.id
    );

    if (existingCell) {
      // If the existing cell is found, update the specific properties and keep the date
      existingCell.cellManager = cellManager;
      existingCell.cellOUt = cellOUt;
      existingCell.showInList = showInList;
    } else {
      // If the cell does not exist in the updatedCell array, add it with the current properties
      this.updatedCell.push({
        ...carsCell,
      });
    }

    console.log(this.updatedCell);
  }
  onDateChange(carsCell: CarsCell, event: any) {
    const updatedCell = this.updatedCell ?? [];
    const formattedDate = formatDate(event, 'yyyy-MM-dd', 'en');
    updatedCell.push({
      ...carsCell,
      cellOutDate: formattedDate,
    });
    // this.findAndReplaceExpert(updatedCell, carsCell);
    console.log(this.updatedCell);
  }

  onTdBlur(event: FocusEvent, cell: CarsCell, property: 'cellRatio'): void {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = cell[property];
    const newValue = tdElement.innerText.trim();
    const updatedCell = this.updatedCell ?? [];

    if (oldValue !== parseFloat(newValue)) {
      cell[property] = parseFloat(newValue);

      // Find the existing cell in the updatedCell array, if it exists
      const existingCell = updatedCell.find((item) => item.id === cell.id);

      if (existingCell) {
        // If the existing cell is found, update the specific property and keep the date
        existingCell[property] = parseFloat(newValue);
      } else {
        // If the cell does not exist in the updatedCell array, add it with the current properties
        updatedCell.push({
          ...cell,
        });
      }

      console.log(this.updatedCell);
    }
  }
  updateCell() {
    if (this.updatedCell?.length) {
      this.dataService.updateCell(this.updatedCell).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          this.updatedCell = [];
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
  openAddCellDialog() {
    const dialogRef = this.dialog.open(AddCellComponent, {
      data: {
        dico: this.dico,
        selectedCase: this.selectedCase,
        users: this.users,
      },
      width: '350px',
      maxHeight: '650px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCarsCell();
    });
  }

  getUsers() {
    this.dataService.getAllUsers(this.substring!).subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteCell(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCell(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message);
            this.getCarsCell();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              this.alertifyService.dialogAlert(err.error.message);
            }
          },
        });
      }
    );
  }
}
