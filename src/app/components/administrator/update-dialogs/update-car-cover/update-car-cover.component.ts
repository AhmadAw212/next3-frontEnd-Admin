import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CarCover } from 'src/app/model/car-cover';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-update-car-cover',
  templateUrl: './update-car-cover.component.html',
  styleUrls: ['./update-car-cover.component.css'],
})
export class UpdateCarCoverComponent {
  selectedCarCover?: CarCover;
  code?: string;
  description?: string;
  types?: type[];
  type?: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateCarCoverComponent>,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {
    this.selectedCarCover = this.data.carCover;
    this.code = data.carCover.code;
    this.description = data.carCover.description;
    this.types = data.type;
    this.type = data.carCover.type;
    console.log(this.type);
  }

  updateCarCover() {
    const updateCarCover: CarCover = {
      id: this.selectedCarCover?.id,
      insuranceId: this.selectedCarCover?.insuranceId,
      description: this.description,
      code: this.code,
      type: this.type,
    };
    this.dataService.updateCarCover([updateCarCover]).subscribe({
      next: (res) => {
        this.alertifyService.success(res.message!);
        this.dialogRef.close();
        console.log(res);
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
