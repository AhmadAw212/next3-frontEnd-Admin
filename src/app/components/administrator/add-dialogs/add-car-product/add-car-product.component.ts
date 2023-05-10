import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarProducts } from 'src/app/model/car-products';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-add-car-product',
  templateUrl: './add-car-product.component.html',
  styleUrls: ['./add-car-product.component.css'],
})
export class AddCarProductComponent {
  code?: string;
  description?: string;
  tarif?: string;
  lob?: string;
  productType?: string;
  productTypes?: type[];
  insuranceId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarProductComponent>
  ) {
    this.productTypes = this.data.type;
    this.insuranceId = this.data.company;
    // console.log(data);
  }

  addCarProduct() {
    const carProduct: CarProducts = {
      insuranceId: this.insuranceId,
      code: this.code,
      description: this.description,
      type: this.productType,
      lob: this.lob,
      tarif: this.tarif,
    };

    this.dataService.addCarProduct(carProduct).subscribe({
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
