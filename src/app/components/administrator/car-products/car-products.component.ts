import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarProducts } from 'src/app/model/car-products';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarProductComponent } from '../add-dialogs/add-car-product/add-car-product.component';

import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-car-products',
  templateUrl: './car-products.component.html',
  styleUrls: ['./car-products.component.css'],
})
export class CarProductsComponent implements OnInit {
  code?: string = '';
  description?: string = '';
  company?: string;
  reportDateTimeFormat?: string;
  productsTypes?: type[];
  companies?: CompanyBranchList[];
  carProducts?: CarProducts[];
  updatedCarProduct?: CarProducts[] = [];
  selectedRow!: HTMLElement;
  dico?: any;
  isLoading?: boolean = false;
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
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getCompaniesPerUser();
    this.getProductsTypes();
    this.getDico();
    this.userRolesService.getUserRoles();
  }
  trackProductById(index: number, product: CarProducts) {
    return product.id;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  exportToExcel() {
    const dico_products = this.dico.dico_product;
    const data = this.carProducts?.map((data) => {
      return {
        ID: data.id,
        Code: data.code,
        Description: data.description,
        Type: data.type_description,
        Tarif: data.tarif,
        LOB: data.lob,
        Company: data.insuranceDesc,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, dico_products);

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = dico_products + '.xlsx';
    saveAs(excelBlob, fileName);
  }
  getDico() {
    this.isLoading = true;
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

  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
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

  getProductsTypes() {
    this.dataService.getCarProductsTypes().subscribe({
      next: (res) => {
        this.productsTypes = res.data;
        // console.log(res.data);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }

  searchCarProducts() {
    this.isLoading = true;
    this.dataService
      .searchCarProducts(this.company!, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.carProducts = res.data;
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
           // this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  deleteCarCover(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarProduct(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarProducts();
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
  onDropdownChange(event: Event, product: CarProducts, property: 'type') {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedCarProduct = this.updatedCarProduct ?? [];
    const index = updatedCarProduct.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      updatedCarProduct.splice(index, 1);
    }
    this.updatedCarProduct?.push({
      id: product.id,
      insuranceId: product.insuranceId,
      code: product.code,
      description: product.description,
      type: product.type,
      tarif: product.tarif,
      lob: product.lob,
    });
    console.log(this.updatedCarProduct);
  }

  onTdBlur(
    event: FocusEvent,
    product: CarProducts,
    property: 'code' | 'description' | 'tarif' | 'lob'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = product[property];
    const newValue = tdElement.innerText.trim();
    const updateCarProduct = this.updatedCarProduct ?? [];

    const index = updateCarProduct.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      updateCarProduct.splice(index, 1);
    }
    if (oldValue !== newValue) {
      product[property] = newValue;
      this.updatedCarProduct?.push({
        id: product.id,
        insuranceId: product.insuranceId,
        code: product.code,
        description: product.description,
        type: product.type,
        tarif: product.tarif,
        lob: product.lob,
      });
      // console.log(this.updatedCarProduct);
    }
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddCarProductComponent, {
      data: {
        company: this.company,
        type: this.productsTypes,
      },
      width: '350px',
      // maxHeight: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarProducts();
    });
  }
  updateCarProduct() {
    if (this.updatedCarProduct?.length) {
      this.dataService.updateCarProduct(this.updatedCarProduct).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message!);
          this.updatedCarProduct = [];

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
  // updateCarProductDialog(carProduct: CarProducts) {
  //   const dialogRef = this.dialog.open(UpdateCarProductComponent, {
  //     data: { carProduct: carProduct, type: this.productsTypes },
  //     width: '350px',
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.searchCarProducts();
  //   });
  // }
}
