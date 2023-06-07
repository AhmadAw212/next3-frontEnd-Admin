import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarProducts } from 'src/app/model/car-products';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-add-car-product',
  templateUrl: './add-car-product.component.html',
  styleUrls: ['./add-car-product.component.css'],
})
export class AddCarProductComponent implements OnInit {
  code?: string;
  description?: string;
  tarif?: string;
  lob?: string;
  productType?: string;
  productTypes?: type[];
  insuranceId: string;
  carCoverForm!: FormGroup;
  dico?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarProductComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.productTypes = this.data.type;
    this.insuranceId = this.data.company;
    // console.log(data);
  }
  ngOnInit(): void {
    this.createForm();
    this.getDico();
  }

  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  createForm() {
    this.carCoverForm = this.formBuilder.group({
      insuranceId: this.insuranceId,
      code: ['', Validators.required],
      description: ['', Validators.required],
      tarif: ['', Validators.required],
      lob: ['', [Validators.required, Validators.maxLength(2)]],
      productType: ['', Validators.required],
    });
  }
  addCarProduct() {
    if (this.carCoverForm.valid) {
      this.dataService.addCarProduct(this.carCoverForm.value).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message!);
          console.log(res);
        },
        error: (err) => {
          if (err.error.statusCode === 409) {
            this.alertifyService.error('Duplicate Records');
          } else if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
}
