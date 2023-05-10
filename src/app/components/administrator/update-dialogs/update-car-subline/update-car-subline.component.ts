import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { CarSublines } from 'src/app/model/car-sublines';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

@Component({
  selector: 'app-update-car-subline',
  templateUrl: './update-car-subline.component.html',
  styleUrls: ['./update-car-subline.component.css'],
})
export class UpdateCarSublineComponent {
  code?: string;
  description?: string;
  notes?: string;
  selectedCarSubline?: CarSublines;
  insuranceId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateCarSublineComponent>,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {
    this.selectedCarSubline = this.data.carSubline;

    this.code = this.selectedCarSubline?.code;
    this.description = this.selectedCarSubline?.description;
    this.notes = this.selectedCarSubline?.notes;
    this.insuranceId = this.selectedCarSubline?.insuranceId!;
    // console.log(this.selectedCarSubline);
  }

  updateCarSubline() {
    const carSubline: CarSublines = {
      id: this.selectedCarSubline?.id,
      insuranceId: this.insuranceId,
      description: this.description,
      code: this.code,
      notes: this.notes,
    };
    this.dataService.updateCarSubline([carSubline]).subscribe({
      next: (res) => {
        this.alertifyService.success(res.message!);
        this.dialogRef.close();
        // console.log(res);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
}
