import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddCarProductComponent } from '../add-car-product/add-car-product.component';
import { CarSublines } from 'src/app/model/car-sublines';

@Component({
  selector: 'app-add-car-subline',
  templateUrl: './add-car-subline.component.html',
  styleUrls: ['./add-car-subline.component.css'],
})
export class AddCarSublineComponent {
  code?: string;
  description?: string;
  notes?: string;
  insuranceId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarSublineComponent>
  ) {
    this.insuranceId = this.data.InsuranceId;
    // console.log(data);
  }

  addCarSubline() {
    const carSubline: CarSublines = {
      insuranceId: this.insuranceId,
      code: this.code,
      description: this.description,
      notes: this.notes,
    };

    this.dataService.addCarSubline(carSubline).subscribe({
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
