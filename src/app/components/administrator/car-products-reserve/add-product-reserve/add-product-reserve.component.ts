import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddCarProductComponent } from '../../add-dialogs/add-car-product/add-car-product.component';
import { CarProducts } from 'src/app/model/car-products';

@Component({
  selector: 'app-add-product-reserve',
  templateUrl: './add-product-reserve.component.html',
  styleUrls: ['./add-product-reserve.component.css'],
})
export class AddProductReserveComponent implements OnInit {
  dico?: any;
  carProductForm!: FormGroup;
  selectedProduct?: CarProducts;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddProductReserveComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
    this.selectedProduct = this.data.selectedProduct;
  }
  createForm() {
    this.carProductForm = this.formBuilder.group({
      carsProductsId: this.selectedProduct?.id,
      carsInsuranceCode: this.selectedProduct?.insuranceId,
      productsResAsOfDate: ['', Validators.required],
      productsResInsured: [
        0,
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      productsResBodily: [
        0,
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      productsResMaterial: [
        0,
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      productsResTp: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      productsResActive: [''],
    });
  }
  get formControl() {
    return this.carProductForm.controls;
  }
  ngOnInit(): void {
    this.createForm();
  }

  addCarProductReserve() {
    if (this.carProductForm.valid) {
      this.dataService
        .addCarProductReserve(this.carProductForm.value)
        .subscribe({
          next: (res) => {
            this.dialogRef.close();
            this.alertifyService.success(res.title!);
            console.log(res);
          },
          error: (err) => {
            if (err.error.statusCode === 409) {
              this.alertifyService.error('Duplicate Records');
            } else {
              console.log(err);
            }
          },
        });
    }
  }
}
