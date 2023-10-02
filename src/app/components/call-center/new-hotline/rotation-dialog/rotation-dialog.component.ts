import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-rotation-dialog',
  templateUrl: './rotation-dialog.component.html',
  styleUrls: ['./rotation-dialog.component.css'],
})
export class RotationDialogComponent implements OnInit {
  dico?: any;
  inOrOutRotation: type[] = [];
  rotationValue: string = 'Y';
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RotationDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.getInOrOutRotation();
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getInOrOutRotation() {
    const result: type[] = [
      { code: 'Y', description: 'IN ROTATION' },
      { code: 'N', description: 'NOT INCLUDE IN ROTATION' },
    ];
    // this.inOutNetwork = result;
    this.inOrOutRotation = result;
    return result;
  }
  saveRotation() {
    this.dialogRef.close(this.rotationValue);
  }
}
