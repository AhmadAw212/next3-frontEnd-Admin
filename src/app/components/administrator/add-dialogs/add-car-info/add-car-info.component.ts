import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarInfo } from 'src/app/model/car-info';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

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
  doors: carInfoList[];
  vehicleSize!: carInfoList[];
  oldBodyType!: carInfoList[];
  newBodyType!: carInfoList[];
  bodyTypeCode!: string;
  fromYear?: number;
  toYear?: number;
  door?: string;
  size?: string;
  bodyTypeNew?: string;
  bodyTypeOld?: string;
  hp?: number = 0;
  denting?: boolean;
  dico?: any;
  carForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private carInfoData: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarInfoComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder
  ) {
    // console.log(this.carInfoData);
    this.doors = carInfoData.doors;
    this.vehicleSize = carInfoData.size;
    this.oldBodyType = carInfoData.oldBodyType;
    this.newBodyType = carInfoData.newBodyType;
  }
  ngOnInit(): void {
    this.CarInfoForm();
    this.getDico();
  }
  CarInfoForm() {
    this.carForm = this.formBuilder.group({
      bodyTypeCode: ['', Validators.required],
      fromYear: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.maxLength(4),
        ],
      ],
      toYear: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.maxLength(4),
        ],
      ],
      doors_lov_code: ['', Validators.required],
      vehicle_size_lov_code: ['', Validators.required],
      bodyType_lov_new_code: ['', Validators.required],
      bodyType_lov_old_code: ['', Validators.required],
      hp: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      denting: [true],
      paintQuality_lov_code: [''],
      value: [0],
      carShapeId: this.carInfoData.selectedShape,
    });
    // this.carForm.get('fromYear')?.valueChanges.subscribe((value) => {
    //   if (typeof value === 'string') {
    //     this.carForm
    //       .get('fromYear')
    //       ?.patchValue(Number(value), { emitEvent: false });
    //   }
    // });

    // this.carForm.get('toYear')?.valueChanges.subscribe((value) => {
    //   if (typeof value === 'string') {
    //     this.carForm
    //       .get('toYear')
    //       ?.patchValue(Number(value), { emitEvent: false });
    //   }
    // });
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  get formControl() {
    return this.carForm.controls;
  }
  addCarInfo() {
    const shapeId = this.carInfoData.selectedShape!;
    console.log(this.carForm.value);
    if (this.carForm.valid) {
      this.dataService.addCarInfo(shapeId, this.carForm.value).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message!);
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
        },
      });
    }
  }
}
