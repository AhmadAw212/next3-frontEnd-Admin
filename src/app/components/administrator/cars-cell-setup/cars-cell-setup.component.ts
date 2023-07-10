import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { CarsCell } from 'src/app/model/cars-cell';
import { CarsCellSetup } from 'src/app/model/cars-cell-setup';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { AddCarCellSetupComponent } from './add-car-cell-setup/add-car-cell-setup.component';
import { CompanyBranchList } from 'src/app/model/company-branch-list';

@Component({
  selector: 'app-cars-cell-setup',
  templateUrl: './cars-cell-setup.component.html',
  styleUrls: ['./cars-cell-setup.component.css'],
})
export class CarsCellSetupComponent implements OnChanges, OnInit {
  @Input() dico?: any;
  selectedRow!: HTMLElement;
  cellSetup?: CarsCellSetup[];
  isLoading?: boolean = false;
  @Input() selectedCell?: CarsCell;
  productTypes?: type[];
  materialDamage?: type[];
  companies?: CompanyBranchList[];
  company?: string;
  updatedCellSetup: CarsCellSetup[] = [];
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
    this.getproductType();
    this.getMaterialDamage();
    this.getCompaniesPerUser();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getCellSetup();
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
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
    const data = this.cellSetup?.map((data) => {
      return {
        ID: data.id,
        'Product Type': data.productType_desc,
        'Material Damage': data.materialDmg_desc,
        'Cell Code': data.cellsCode,
        'Expert Exist': data.expert_exist,
        'Car Count': data.car_count,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, ' Cell Setup');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'Cars_Cell_setup.xlsx');
  }

  getCellSetup() {
    const setupId = this.selectedCell?.managerSetup_id!;
    this.dataService.getCellSetup(setupId).subscribe({
      next: (res) => {
        this.cellSetup = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMaterialDamage() {
    this.dataService.getMaterialDamage().subscribe({
      next: (res) => {
        this.materialDamage = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getproductType() {
    this.dataService.getCarProductsTypes().subscribe({
      next: (res) => {
        this.productTypes = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;

        // console.log(this.companies);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }
  openAddCellSetupDialog() {
    const dialogRef = this.dialog.open(AddCarCellSetupComponent, {
      data: {
        dico: this.dico,
        products: this.productTypes,
        materialDamage: this.materialDamage,
        companies: this.companies,
        selectedCell: this.selectedCell,
      },
      width: '350px',
      maxHeight: '650px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCellSetup();
    });
  }
  findAndReplaceExpert(
    updatedCell: CarsCellSetup[],
    carsCell: CarsCellSetup
  ): void {
    const index = updatedCell.findIndex((item) => item.id === carsCell.id);
    if (index !== -1) {
      updatedCell.splice(index, 1);
    }

    updatedCell.push({
      id: carsCell.id,
      insuranceId: carsCell.insuranceId,
      productType_code: carsCell.productType_code,
      materialDmg_code: carsCell.materialDmg_code,
      caseManagerSetupId: this.selectedCell?.managerSetup_id,
      cellsCode: carsCell.cellsCode,
      car_count: carsCell.car_count,
      expert_exist: carsCell.expert_exist,
    });
  }

  onDropdownChange(
    event: Event,
    cell: CarsCell,
    property: 'insuranceId' | 'productType_code' | 'materialDmg_code'
  ): void {
    const updatedCell = this.updatedCellSetup ?? {};

    this.findAndReplaceExpert(updatedCell, cell);

    console.log(this.updatedCellSetup);
  }
  onCheckboxChange(carsCell: CarsCellSetup): void {
    const cellManager = carsCell.expert_exist ?? false;

    const updatedCell = this.updatedCellSetup ?? {};

    this.findAndReplaceExpert(updatedCell, carsCell);
    console.log(this.updatedCellSetup);
  }
  onTdBlur(
    event: FocusEvent,
    cell: CarsCellSetup,
    property: 'car_count'
  ): void {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = cell[property];
    const newValue = tdElement.innerText.trim();
    const updatedCell = this.updatedCellSetup ?? [];

    if (oldValue !== parseInt(newValue)) {
      cell[property] = parseInt(newValue);

      this.findAndReplaceExpert(updatedCell, cell);
      console.log(this.updatedCellSetup);
    }
  }

  updateCellSetup() {
    if (this.updatedCellSetup?.length) {
      this.dataService.updateCellSetup(this.updatedCellSetup).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          this.updatedCellSetup = [];
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
  deleteCell(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCellSetup(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message);
            this.getCellSetup();
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
