import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddCarProductComponent } from '../add-car-product/add-car-product.component';
import { CarSublines } from 'src/app/model/car-sublines';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-car-subline',
  templateUrl: './add-car-subline.component.html',
  styleUrls: ['./add-car-subline.component.css'],
})
export class AddCarSublineComponent implements OnInit {
  code?: string;
  description?: string;
  notes?: string;
  insuranceId: string;
  dico?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarSublineComponent>,
    private dicoService: DicoServiceService
  ) {
    this.insuranceId = this.data.InsuranceId;
    // console.log(data);
  }
  ngOnInit(): void {
    this.getDico();
  }

  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
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
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
      },
    });
  }
}
