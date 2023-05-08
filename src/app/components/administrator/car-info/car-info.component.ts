import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarInfo } from 'src/app/model/car-info';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarInfoComponent } from '../add-car-info/add-car-info.component';
import { CarShape } from 'src/app/model/car-shape';

interface carInfoList {
  code: string;
  description: string;
}

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css'],
})
export class CarInfoComponent implements OnInit {
  @Input() carInfo?: CarInfo[];
  doors?: carInfoList[];
  vehicleSize?: carInfoList[];
  bodyType?: carInfoList[];
  bodyTypeNew?: carInfoList[];
  @Input() selectedShape?: CarShape;
  reportDateTimeFormat?: string;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.getDoors();
    this.getVehicleSize();
    this.getOldBodyType();
    this.getNewBodyType();
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }

  getDoors() {
    this.dataService.carInfoDoors().subscribe({
      next: (res) => {
        this.doors = res.data.doorsList;
        // console.log(res.data);
      },
    });
  }

  getVehicleSize() {
    this.dataService.carInfoGetVehicleSize().subscribe({
      next: (res) => {
        this.vehicleSize = res.data.vehicleSizeList;
        // console.log(res.data);
      },
    });
  }

  getOldBodyType() {
    this.dataService.carInfoGetOldBodyType().subscribe({
      next: (res) => {
        this.bodyType = res.data.bodyTypeList;
        // console.log(res.data);
      },
    });
  }

  getNewBodyType() {
    this.dataService.carInfoGetNewBodyType().subscribe({
      next: (res) => {
        this.bodyTypeNew = res.data.bodyTypeList;
        // console.log(res.data);
      },
    });
  }

  searchCarInfo() {
    const shapeId = this.selectedShape?.carShapeId!;
    this.dataService.getcarInfo(shapeId).subscribe({
      next: (res) => {
        this.carInfo = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteCarInfo(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarInfo(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarInfo();
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

  openAddCarInfoDialog() {
    const dialog = this.dialog.open(AddCarInfoComponent, {
      data: {
        newBodyType: this.bodyTypeNew,
        oldBodyType: this.bodyType,
        size: this.vehicleSize,
        doors: this.doors,
        selectedShape: this.selectedShape?.carShapeId,
      },
      width: '400px',
      maxHeight: '600px',
    });
    dialog.afterClosed().subscribe(() => this.searchCarInfo());
  }
}
