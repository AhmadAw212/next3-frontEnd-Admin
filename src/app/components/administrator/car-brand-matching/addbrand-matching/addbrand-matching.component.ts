import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddProductReserveComponent } from '../../car-products-reserve/add-product-reserve/add-product-reserve.component';

@Component({
  selector: 'app-addbrand-matching',
  templateUrl: './addbrand-matching.component.html',
  styleUrls: ['./addbrand-matching.component.css'],
})
export class AddbrandMatchingComponent implements OnInit {
  dico?: any;
  carBrandMatching!: FormGroup;
  company?: string;
  brandId?: string;
  trademarkId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddbrandMatchingComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
    (this.company = this.data.company),
      (this.brandId = this.data.brandId),
      (this.trademarkId = this.data.trademarkId);
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.carBrandMatching = this.formBuilder.group({
      brandId: this.brandId,
      trademarkId: this.trademarkId,
      insId: this.company,
      insModelCode: ['', Validators.required],
      insMakeCode: ['', Validators.required],
      modelName: ['', Validators.required],
    });
  }
  get formControl() {
    return this.carBrandMatching.controls;
  }

  addBrandMatching() {
    if (this.carBrandMatching.valid) {
      this.dataService.addCarMatching(this.carBrandMatching.value).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.title!);
          console.log(res);
        },
        error: (err) => {
          if (err.error.statusCode === 409) {
            this.alertifyService.error('Duplicate Records');
          } else {
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
}
