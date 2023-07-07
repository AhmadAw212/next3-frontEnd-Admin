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
import { CarProducts } from 'src/app/model/car-products';
import { ProductsReserve } from 'src/app/model/products-reserve';
import { AddProductReserveComponent } from './add-product-reserve/add-product-reserve.component';
@Component({
  selector: 'app-car-products-reserve',
  templateUrl: './car-products-reserve.component.html',
  styleUrls: ['./car-products-reserve.component.css'],
})
export class CarProductsReserveComponent implements OnInit, OnChanges {
  selectedRow!: HTMLElement;
  dateFormats?: any;
  isLoading?: boolean = false;
  @Input() dico?: any;
  @Input() selectedProduct?: CarProducts;
  carProdReserve?: ProductsReserve[];
  updatedCarProductReserve: ProductsReserve[] = [];
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
    this.searchCarProductsReserve();
  }

  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    // this.searchCarProductsReserve();
    // this.getDico();
    this.userRolesService.getUserRoles();
  }
  getDico() {
    this.isLoading = true;
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  trackProductById(index: number, productReserve: ProductsReserve) {
    return productReserve.productsResId;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  exportToExcel() {
    const dico_products_reserve = this.dico.dico_product_reserve;
    const data = this.carProdReserve?.map((data) => {
      return {
        ID: data.productsResId,
        Date: this.datePipe.transform(
          data.productsResAsOfDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        Insured: data.productsResInsured,
        Tp: data.productsResTp,
        Bodily: data.productsResBodily,
        Material: data.productsResMaterial,
        Active: data.productsResActive,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, dico_products_reserve);

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = dico_products_reserve + '.xlsx';
    saveAs(excelBlob, fileName);
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

  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  onTdBlur(
    event: FocusEvent,
    product: ProductsReserve,
    property:
      | 'productsResInsured'
      | 'productsResTp'
      | 'productsResBodily'
      | 'productsResMaterial'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = product[property];
    const newValue = tdElement.innerText.trim();
    const updateCarProduct = this.updatedCarProductReserve ?? [];

    const index = updateCarProduct.findIndex(
      (item) => item.productsResId === product.productsResId
    );
    if (index !== -1) {
      updateCarProduct.splice(index, 1);
    }
    if (oldValue !== parseInt(newValue)) {
      product[property] = parseInt(newValue);
      this.updatedCarProductReserve?.push({
        productsResId: product.productsResId,
        productsResAsOfDate: product.productsResAsOfDate,
        productsResInsured: product.productsResInsured,
        productsResTp: product.productsResTp,
        productsResBodily: product.productsResBodily,
        productsResMaterial: product.productsResMaterial,
        productsResActive: product.productsResActive,
      });
      console.log(this.updatedCarProductReserve);
    }
  }
  findAndReplaceExpert(
    productReserve: ProductsReserve[],
    product: ProductsReserve
  ): void {
    const index = productReserve.findIndex(
      (item) => item.productsResId === product.productsResId
    );
    if (index !== -1) {
      productReserve.splice(index, 1);
    }

    productReserve?.push({
      productsResId: product.productsResId,
      productsResAsOfDate: product.productsResAsOfDate,
      productsResInsured: product.productsResInsured,
      productsResTp: product.productsResTp,
      productsResBodily: product.productsResBodily,
      productsResMaterial: product.productsResMaterial,
      carsInsuranceCode: product.carsInsuranceCode,
      productsResActive: product.productsResActive,
    });
  }
  onCheckboxChange(product: ProductsReserve): void {
    const productsResActive = product.productsResActive ?? false;

    const updatedProduct = this.updatedCarProductReserve ?? {};

    this.findAndReplaceExpert(updatedProduct, product);
    console.log(this.updatedCarProductReserve);
  }
  searchCarProductsReserve() {
    this.isLoading = true;
    const productId = this.selectedProduct?.id!;
    this.dataService.getCarProductReserve(productId).subscribe({
      next: (res) => {
        this.carProdReserve = res.data;
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

  updateProductReserve() {
    if (this.updatedCarProductReserve?.length) {
      this.dataService
        .updateProductReserve(this.updatedCarProductReserve)
        .subscribe({
          next: (res) => {
            this.alertifyService.success(res.title);
            this.updatedCarProductReserve = [];

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

  deleteProductReserve(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteProductReserve(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title);
            this.searchCarProductsReserve();
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
  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductReserveComponent, {
      data: { dico: this.dico, selectedProduct: this.selectedProduct },
      width: '350px',
      // maxHeight: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarProductsReserve();
    });
  }
}
