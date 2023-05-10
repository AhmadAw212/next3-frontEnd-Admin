import { Component, Inject, Input } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarTrademark } from 'src/app/model/car-trademark';

@Component({
  selector: 'app-add-trademark-dialog',
  templateUrl: './add-trademark-dialog.component.html',
  styleUrls: ['./add-trademark-dialog.component.css'],
})
export class AddTrademarkDialogComponent {
  id?: string = '';
  code?: string;
  description?: string;
  file?: File;

  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddTrademarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carBrand: CarTrademark
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
    console.log(this.carBrand);
  }

  saveTrademark() {
    const carBrandId = this.carBrand.carBrandId!;

    this.dataService
      .saveCarTrademark(
        this.id!,
        this.code!,
        this.description!,
        carBrandId,
        this.file!
      )
      .subscribe({
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
