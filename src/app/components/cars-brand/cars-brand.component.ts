import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarBrandDialogComponent } from '../add-car-brand-dialog/add-car-brand-dialog.component';

@Component({
  selector: 'app-cars-brand',
  templateUrl: './cars-brand.component.html',
  styleUrls: ['./cars-brand.component.css'],
})
export class CarsBrandComponent {
  description: string = '';
  code: string = '';
  carsBrandData?: CarsBrand[];
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  carsBrandSearch() {
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

  openAddCarBrandDialog() {
    this.dialog.open(AddCarBrandDialogComponent);
  }
}
