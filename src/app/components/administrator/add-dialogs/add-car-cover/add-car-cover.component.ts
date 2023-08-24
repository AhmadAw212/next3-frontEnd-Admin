import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddCarInfoComponent } from '../add-car-info/add-car-info.component';
import { CarCover } from 'src/app/model/car-cover';
import { DicoServiceService } from 'src/app/services/dico-service.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-add-car-cover',
  templateUrl: './add-car-cover.component.html',
  styleUrls: ['./add-car-cover.component.css'],
})
export class AddCarCoverComponent {
  type: type[];
  insuranceId?: string;
  code?: string;
  description?: string;
  typeSelect?: string;
  dico?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarCoverComponent>,
    private dicoService: DicoServiceService
  ) {
    this.type = this.data.types;
    this.insuranceId = this.data.insuranceId;
    // console.log(this.insuranceId);
  }
  ngOnInit(): void {
    this.getDico();
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  addCarCover() {
    const carCover: CarCover = {
      insuranceId: this.insuranceId,
      code: this.code,
      description: this.description,
      type: this.typeSelect,
    };

    this.dataService.addCarCover(carCover).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.alertifyService.success(res.message!);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
