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
          console.log(err);
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

  updateCarProductDialog(carProduct: CarProducts) {
    const dialogRef = this.dialog.open(UpdateCarProductComponent, {
      data: { carProduct: carProduct, type: this.productsTypes },
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchCarProducts();
    });
  }
}
