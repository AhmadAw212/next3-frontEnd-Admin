import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarShape } from 'src/app/model/car-shape';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddShapeDialogComponent } from '../add-shape-dialog/add-shape-dialog.component';
import { UpdateShapeDialogComponent } from '../update-shape-dialog/update-shape-dialog.component';
import { CarTrademark } from 'src/app/model/car-trademark';

@Component({
  selector: 'app-car-shape',
  templateUrl: './car-shape.component.html',
  styleUrls: ['./car-shape.component.css'],
})
export class CarShapeComponent {
  @Input() carShape?: CarShape[];
  @Input() carTradeMark?: CarTrademark;
  @Input() selectedTrademark?: CarTrademark;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {}

  searchCarShape() {
    const trademarkId = this.selectedTrademark?.id!;
    this.dataService.searchCarShape(trademarkId).subscribe({
      next: (res) => {
        this.carShape = res.data.map((res: CarShape) => {
          return {
            ...res,
            logo: `data:image/jpeg;base64,${res.logo}`,
          };
        });
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deleteCarShape(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarShape(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.title!);
            // this.carTrademarkSearch();
            this.searchCarShape();
            // console.log(data);
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  openAddCarShapeDialog() {
    const dialog = this.dialog.open(AddShapeDialogComponent, {
      data: this.selectedTrademark,
    });
    dialog.afterClosed().subscribe(() => this.searchCarShape());
  }

  updateShapeDialog(carShape: CarShape) {
    const dialogRef = this.dialog.open(UpdateShapeDialogComponent, {
      data: carShape,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.searchCarShape();
    });
  }
}
