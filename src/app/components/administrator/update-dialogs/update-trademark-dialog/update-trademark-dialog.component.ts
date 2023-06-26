import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarTrademark } from 'src/app/model/car-trademark';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-update-trademark-dialog',
  templateUrl: './update-trademark-dialog.component.html',
  styleUrls: ['./update-trademark-dialog.component.css'],
})
export class UpdateTrademarkDialogComponent implements OnInit {
  code?: string;
  description?: string;
  file?: File;
  dico?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public trademark: CarTrademark,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<UpdateTrademarkDialogComponent>,
    private dicoService: DicoServiceService
  ) {
    // console.log(trademark);
    this.code = trademark.code;
    this.description = trademark.description;
    this.file = trademark.logo;
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

  saveTrademark() {
    const carBrandId = this.trademark.carBrandId!;
    const id = this.trademark.id!;
    this.dataService
      .saveCarTrademark(
        id,
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
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
  }
  onCancel() {
    this.dialogRef.close();
  }
}
