import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarInfo } from 'src/app/model/car-info';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';

interface carInfoList {
  code: string;
  description: string;
}

@Component({
  selector: 'app-add-car-info',
  templateUrl: './add-car-info.component.html',
  styleUrls: ['./add-car-info.component.css'],
})
export class AddCarInfoComponent {
  doors!: carInfoList[];
  vehicleSize!: carInfoList[];
  oldBodyType!: carInfoList[];
  newBodyType!: carInfoList[];
  bodyTypeCode?: string;
  fromYear?: number;
  toYear?: number;
  door?: string;
  size?: string;
  bodyTypeNew?: string;
  bodyTypeOld?: string;
  hp?: number = 0;
  denting?: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) private carInfoData: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarInfoComponent>
  ) {
    console.log(this.carInfoData);
    this.doors = carInfoData.doors;
    this.vehicleSize = carInfoData.size;
    this.oldBodyType = carInfoData.oldBodyType;
    this.newBodyType = carInfoData.newBodyType;
  }

  addCarInfo() {
    const shapeId = this.carInfoData.selectedShape!;
    const carInfo: CarInfo = {
      bodyTypeCode: this.bodyTypeCode,
      bodyType_lov_new_code: this.bodyTypeNew,
      bodyType_lov_old_code: this.bodyTypeOld,
      doors_lov_code: this.door,
      vehicle_size_lov_code: this.size,
      fromYear: this.fromYear,
      toYear: this.toYear,
      hp: this.hp,
      denting: this.denting,
    };
    this.dataService.addCarInfo(shapeId, carInfo).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.alertifyService.success(res.message!);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
