import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarProducts } from 'src/app/model/car-products';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarProductComponent } from '../add-dialogs/add-car-product/add-car-product.component';
import { UpdateCarProductComponent } from '../update-dialogs/update-car-product/update-car-product.component';

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
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}
  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getCompaniesPerUser();
    this.getProductsTypes();
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
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
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

  getProductsTypes() {
    this.dataService.getCarProductsTypes().subscribe({
      next: (res) => {
        this.productsTypes = res.data;
        // console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchCarProducts() {
    this.dataService
      .searchCarProducts(this.company!, this.code!, this.description!)
      .subscribe({
        next: (res) => {
          this.carProducts = res.data;
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
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
              this.authService.logout();
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
            this.authService.logout();
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
