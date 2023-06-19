import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarShape } from 'src/app/model/car-shape';
import { CarTrademark } from 'src/app/model/car-trademark';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-shape-dialog',
  templateUrl: './add-shape-dialog.component.html',
  styleUrls: ['./add-shape-dialog.component.css'],
})
export class AddShapeDialogComponent implements OnInit {
  code?: string;
  description?: string;
  file?: File;
  id?: string;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddShapeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carShape: CarTrademark,
    private dicoService: DicoServiceService
  ) {
    // console.log(carShape);
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

  addCarShape() {
    const tradeMarkId = this.carShape.id;

    this.dataService
      .saveCarShape(
        this.id!,
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
}
