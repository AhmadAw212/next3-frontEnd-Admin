import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarBrandDialogComponent } from '../add-car-brand-dialog/add-car-brand-dialog.component';
import { UpdateCarDialogComponent } from '../update-car-dialog/update-car-dialog.component';
import { CarTrademark } from 'src/app/model/car-trademark';

@Component({
  selector: 'app-cars-brand',
  templateUrl: './cars-brand.component.html',
  styleUrls: ['./cars-brand.component.css'],
})
export class CarsBrandComponent implements OnInit {
  description: string = '';
  code: string = '';
  carsBrandData?: CarsBrand[];
  file?: File;
  carBrandData?: CarsBrand;
  carTrademark?: CarTrademark[];
  showTrademark = false;
  reportDateTimeFormat?: string;
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
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }

  // showTrademarkList() {}

  carsBrandSearch() {
    this.showTrademark = false;
    this.dataService.carsBrandSearch(this.code, this.description).subscribe({
      next: (data) => {
        this.carsBrandData = data.data.map((res: CarsBrand) => {
          // console.log(`data:image/jpeg;base64,${res.content}`);
          return {
            ...res,
            content: `data:image/jpeg;base64,${res.content}`,
          };
        });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  carsTrademarkSearch(id: string, brand: CarsBrand) {
    if (brand.carBrandId !== this.carBrandData?.carBrandId) {
      this.showTrademark = false;
    }
    this.carBrandData = brand;
    this.dataService.carsTrademarkByCarId(id).subscribe({
      next: (res) => {
        this.carTrademark = res.data.map((res: CarTrademark) => {
          return {
            ...res,
            logo: `data:image/jpeg;base64,${res.logo}`,
          };
        });
        if (brand.carBrandId === this.carBrandData?.carBrandId) {
          this.showTrademark = true;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteCarBrand(code: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarBrand(code).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title!);
            this.carsBrandSearch();
            // console.log(data);
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
  }
  openAddCarBrandDialog() {
    this.dialog.open(AddCarBrandDialogComponent);
  }

  updateCarBrandDialog(car: CarsBrand) {
    const dialogRef = this.dialog.open(UpdateCarDialogComponent, { data: car });
    dialogRef.afterClosed().subscribe(() => {
      this.carsBrandSearch();
    });
  }
}
