import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarShape } from 'src/app/model/car-shape';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-update-shape-dialog',
  templateUrl: './update-shape-dialog.component.html',
  styleUrls: ['./update-shape-dialog.component.css'],
})
export class UpdateShapeDialogComponent implements OnInit {
  code?: string;
  description?: string;
  file?: File;
  dico?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public carShape: CarShape,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<UpdateShapeDialogComponent>,
    private dicoService: DicoServiceService
  ) {
    // console.log(carShape);
    this.code = carShape.carShapeCode;
    this.description = carShape.carShapeDescription;
    this.file = carShape.logo;
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

  updateCarShape() {
    const tradeMarkId = this.carShape.carTrademarkId;
    const shapeId = this.carShape.carShapeId;
    this.dataService
      .saveCarShape(
        shapeId,
        this.code!,
        this.description!,
        tradeMarkId,
        this.file!
      )
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.title!);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onCancel() {
    this.dialogRef.close();
  }
}
