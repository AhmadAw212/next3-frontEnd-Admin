import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-tow-conditions-dialog',
  templateUrl: './tow-conditions-dialog.component.html',
  styleUrls: ['./tow-conditions-dialog.component.css'],
})
export class TowConditionsDialogComponent implements OnInit {
  domainYn?: type[] = [];
  dico?: any;
  lossTowBlockedId: string = '';
  lossTowOffRoadId: string = '';
  lossTowPickUpId: string = '';
  lossTowWheelId: string = ' ';
  lossTowCarryingGoodId: string = '';
  lossTowLifterId: string = '';
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<TowConditionsDialogComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.domainYn = data.domainYn;
    if (this.data) {
      this.lossTowBlockedId = data.lossTowBlockedId;
      this.lossTowLifterId = data.lossTowLifterId;
      this.lossTowOffRoadId = data.lossTowOffRoadId;
      this.lossTowPickUpId = data.lossTowPickUpId;
      this.lossTowWheelId = data.lossTowWheelId;
      this.lossTowCarryingGoodId = data.lossTowCarryingGoodId;
    }
  }
  ngOnInit(): void {
    this.getDico();
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  cancel() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close({
      lossTowBlockedId: this.lossTowBlockedId,
      lossTowLifterId: this.lossTowLifterId,
      lossTowOffRoadId: this.lossTowOffRoadId,
      lossTowPickUpId: this.lossTowPickUpId,
      lossTowWheelId: this.lossTowWheelId,
      lossTowCarryingGoodId: this.lossTowCarryingGoodId,
    });
  }
}
