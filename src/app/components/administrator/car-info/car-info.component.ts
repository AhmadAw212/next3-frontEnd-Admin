import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarInfo } from 'src/app/model/car-info';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarInfoComponent } from '../add-dialogs/add-car-info/add-car-info.component';
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
  updatedCarInfoVal?: CarInfo[] = [];
  selectedRow!: HTMLElement;
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
  trackInfoById(index: number, brand: CarInfo) {
    return brand.id;
  }
  highlightRow(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedRow = clickedElement.closest('tr');

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow!;
    this.selectedRow.classList.add('highlight');
  }
  onTdBlur(
    event: FocusEvent,
    carInfo: CarInfo,
    property: 'fromYear' | 'toYear' | 'bodyTypeCode'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = carInfo[property];
    const newValue = tdElement.innerText.trim();
    const updatedCarInfoVal = this.updatedCarInfoVal ?? [];

    const index = updatedCarInfoVal.findIndex((item) => item.id === carInfo.id);
    if (index !== -1) {
      updatedCarInfoVal.splice(index, 1);
    }

    const denting = carInfo.denting ?? false;
    if (oldValue !== newValue) {
      carInfo[property] = this.convertValue(newValue, property);
      this.updatedCarInfoVal?.push({
        id: carInfo.id,
        fromYear: carInfo.fromYear,
        toYear: carInfo.toYear,
        bodyTypeCode: carInfo.bodyTypeCode,
        bodyType_lov_new_code: carInfo.bodyType_lov_new_code,
        bodyType_lov_old_code: carInfo.bodyType_lov_old_code,
        vehicle_size_lov_code: carInfo.vehicle_size_lov_code,
        doors_lov_code: carInfo.doors_lov_code,
        // hp: carInfo.hp,
        hp: 0,
        denting,
      });
      // console.log(this.updatedCarInfoVal);
    }
  }

  onCheckboxChange(carInfo: CarInfo) {
    const denting = carInfo.denting ?? false;
    const updatedDomainValues = this.updatedCarInfoVal ?? [];
    const index = updatedDomainValues.findIndex(
      (item) => item.id === carInfo.id
    );
    if (index !== -1) {
      updatedDomainValues.splice(index, 1);
    }
    this.updatedCarInfoVal?.push({
      id: carInfo.id,
      fromYear: carInfo.fromYear,
      toYear: carInfo.toYear,
      bodyTypeCode: carInfo.bodyTypeCode,
      bodyType_lov_new_code: carInfo.bodyType_lov_new_code,
      bodyType_lov_old_code: carInfo.bodyType_lov_old_code,
      vehicle_size_lov_code: carInfo.vehicle_size_lov_code,
      doors_lov_code: carInfo.doors_lov_code,
      // hp: carInfo.hp,
      hp: 0,
      denting,
    });
    // console.log(this.updatedCarInfoVal);
  }

  convertValue(
    value: string,
    property: 'fromYear' | 'toYear' | 'bodyTypeCode'
  ): any {
    if (property === 'fromYear' || property === 'toYear') {
      return parseInt(value, 10); // Convert the value to a number
    }
    return value;
  }

  onDropdownChange(
    event: Event,
    carInfo: CarInfo,
    property:
      | 'bodyType_lov_new_code'
      | 'bodyType_lov_old_code'
      | 'doors_lov_code'
      | 'vehicle_size_lov_code'
  ) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedCarInfoVal = this.updatedCarInfoVal ?? [];
    const index = updatedCarInfoVal.findIndex((item) => item.id === carInfo.id);
    if (index !== -1) {
      updatedCarInfoVal.splice(index, 1);
    }
    this.updatedCarInfoVal?.push({
      id: carInfo.id,
      fromYear: carInfo.fromYear,
      toYear: carInfo.toYear,
      bodyTypeCode: carInfo.bodyTypeCode,
      bodyType_lov_new_code: carInfo.bodyType_lov_new_code,
      bodyType_lov_old_code: carInfo.bodyType_lov_old_code,
      vehicle_size_lov_code: carInfo.vehicle_size_lov_code,
      doors_lov_code: carInfo.doors_lov_code,
      // hp: carInfo.hp,
      hp: 0,
      denting: carInfo.denting ?? false,
    });
    // console.log(this.updatedCarInfoVal);
  }
  updateCarInfo() {
    if (this.updatedCarInfoVal?.length) {
      this.dataService.updateCarInfo(this.updatedCarInfoVal).subscribe({
        next: (res) => {
          this.alertifyService.success(res.message!);
          this.updatedCarInfoVal = [];
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
