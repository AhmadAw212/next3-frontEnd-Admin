import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CarProducts } from 'src/app/model/car-products';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-update-car-product',
  templateUrl: './update-car-product.component.html',
  styleUrls: ['./update-car-product.component.css'],
})
export class UpdateCarProductComponent {
  selectedCarproduct: CarProducts;
  code?: string;
  description?: string;
  productTypes?: type[];
  type?: string;
  tarif?: string;
  lob?: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateCarProductComponent>,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService
  ) {
    this.selectedCarproduct = this.data.carProduct;
    this.code = data.carProduct.code;
    this.description = data.carProduct.description;
    this.type = data.carProduct.type;
    this.tarif = data.carProduct.tarif;
    this.lob = data.carProduct.lob;
    this.productTypes = data.type;
    // console.log(data);
  }

  updateCarProduct() {
    const updateCarProduct: CarProducts = {
      id: this.selectedCarproduct?.id,
      insuranceId: this.selectedCarproduct?.insuranceId,
      description: this.description,
      code: this.code,
      type: this.type,
      tarif: this.tarif,
      lob: this.lob,
    };
    this.dataService.updateCarProduct([updateCarProduct]).subscribe({
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
