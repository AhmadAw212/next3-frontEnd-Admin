import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarTrademark } from 'src/app/model/car-trademark';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddTrademarkDialogComponent } from '../add-trademark-dialog/add-trademark-dialog.component';
import { UpdateTrademarkDialogComponent } from '../update-trademark-dialog/update-trademark-dialog.component';
import { CarShape } from 'src/app/model/car-shape';

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
              this.authService.logout();
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
    });
  }
}