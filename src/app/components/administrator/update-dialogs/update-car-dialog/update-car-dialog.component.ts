import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-update-car-dialog',
  templateUrl: './update-car-dialog.component.html',
  styleUrls: ['./update-car-dialog.component.css'],
})
export class UpdateCarDialogComponent {
  code?: string;
  description?: string;
  file?: File;
  dico?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public car: CarsBrand,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UpdateCarDialogComponent>,
    private dicoService: DicoServiceService
  ) {
    console.log(car);
    this.code = car.carBrandCode;
    this.description = car.carBrandDescription;
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
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
  }

  updateCarBrand() {
    this.dataService
      .addCarBrand(this.code!, this.description!, this.file!)
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.title!);
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onCancel() {
    this.dialog.closeAll();
  }
}
